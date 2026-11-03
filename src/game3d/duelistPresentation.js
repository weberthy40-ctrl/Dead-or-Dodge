/** Readability treatment for the local Duelist only; cached source assets stay intact. */
export function applyDuelistReadability(material) {
  material.color.setHex(0xdbe7f5);
  material.metalness = .18;
  material.roughness = .64;
  const palette = material.onBeforeCompile;
  material.onBeforeCompile = function(shader, renderer) {
    palette.call(this, shader, renderer);
    shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      float riftRim = pow(1.0 - max(dot(normalize(normal), normalize(vViewPosition)), 0.0), 2.4);
      totalEmissiveRadiance += vec3(0.22, 0.38, 0.65) * riftRim * 0.35;
    `);
  };
  material.customProgramCacheKey = () => 'rift-duelist-readable-v1';
}
