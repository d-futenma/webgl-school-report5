precision mediump float;

varying vec4 vColor;

void main() {
  vec3 rgb = vColor.rgb;
  float alpha = 1.0;
  gl_FragColor = vec4(rgb, alpha);
}