attribute vec3 position;
attribute vec4 color;
varying vec4 vColor;
uniform float angle;

void main() {
  float s = sin(angle);
  float c = cos(angle);

  mat3 rotationMatrix = mat3(
    c, -s, 0.0,
    s, c, 0.0,
    0.0, 0.0, 1.0
  );

  vec3 rotatedPosition = rotationMatrix * position;
  
  // フラグメントシェーダに送る色の情報を varying 変数に代入
  vColor = color;
  // 頂点座標の出力
  gl_Position = vec4(rotatedPosition, 1.0);
}



