import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import { build } from "esbuild";
import { fileURLToPath } from "node:url";

let hasBiomeOnEdge;
let checkShareEdge;

before(async () => {
  const { outputFiles } = await build({
    entryPoints: [fileURLToPath(new URL("../src/systems/scoring/share-edge.system.ts", import.meta.url))],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
  });
  const source = Buffer.from(outputFiles[0].contents).toString("base64");
  ({ hasBiomeOnEdge, checkShareEdge } = await import(`data:text/javascript;base64,${source}`));
});

describe("hasBiomeOnEdge", () => {
  it("matches the only biome on every edge regardless of rotation", () => {
    for (let rotation = 0; rotation < 6; rotation++) {
      const tile = { bioms: [1], rotation };
      for (let edge = 0; edge < 6; edge++) {
        assert.equal(hasBiomeOnEdge(tile, 1, edge), true);
        assert.equal(hasBiomeOnEdge(tile, 2, edge), false);
      }
    }
  });

  it("returns false when the tile has no biomes", () => {
    assert.equal(hasBiomeOnEdge({ bioms: [] }, 1, 0), false);
  });

  it("selects the correct biome for every edge and rotation", () => {
    const tile = { bioms: [1, 2] };

    for (let rotation = 0; rotation < 6; rotation++) {
      for (let edge = 0; edge < 6; edge++) {
        const unrotatedEdge = (edge - rotation + 6) % 6;
        const expectedBiome = unrotatedEdge < 3 ? 1 : 2;

        assert.equal(hasBiomeOnEdge({ ...tile, rotation }, expectedBiome, edge), true);
        assert.equal(hasBiomeOnEdge({ ...tile, rotation }, 3 - expectedBiome, edge), false);
      }
    }
  });

  it("defaults an omitted rotation to zero", () => {
    const tile = { bioms: [1, 2] };

    assert.equal(hasBiomeOnEdge(tile, 1, 2), true);
    assert.equal(hasBiomeOnEdge(tile, 2, 3), true);
  });

  it("matches the biome across all neighbor directions and tile rotations", () => {
    const directions = [
      { opposite: { intX: -1, intY: -1 }, sharedEdge: 3 },
      { opposite: { intX: -2, intY: 0 }, sharedEdge: 4 },
      { opposite: { intX: -1, intY: 1 }, sharedEdge: 5 },
      { opposite: { intX: 1, intY: 1 }, sharedEdge: 0 },
      { opposite: { intX: 2, intY: 0 }, sharedEdge: 1 },
      { opposite: { intX: 1, intY: -1 }, sharedEdge: 2 },
    ];

    for (const { opposite, sharedEdge } of directions) {
      for (let currentRotation = 0; currentRotation < 6; currentRotation++) {
        for (let neighborRotation = 0; neighborRotation < 6; neighborRotation++) {
          const current = { bioms: [1, 2], rotation: currentRotation };
          const neighbor = { bioms: [1, 2], rotation: neighborRotation };
          const currentBiomeIndex = (sharedEdge - currentRotation + 6) % 6 < 3 ? 0 : 1;
          const neighborEdge = (sharedEdge + 3) % 6;
          const neighborBiomeIndex = (neighborEdge - neighborRotation + 6) % 6 < 3 ? 0 : 1;
          const expected = currentBiomeIndex === 0 && neighborBiomeIndex === 0;
          const message = JSON.stringify({ opposite, currentRotation, neighborRotation });

          assert.equal(checkShareEdge(current, neighbor, 1, opposite), expected, message);
        }
      }
    }
  });
});
