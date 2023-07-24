import GUI from 'lil-gui'
import { WebGLUtility } from './webgl.js';
import vertex from './shader/vertexShader.glsl';
import fragment from './shader/fragmentShader.glsl';

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
  app.load()
  .then(() => {
    app.setupGeometry();
    app.setupLocation();
    app.start();
  });
}, false);

class App {
  get COLOR_RGB() {
    return [0.670, 0.5960, 0.478];
  }

  constructor() {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.uniformLocation = null;
    this.position = null;
    this.positionStride = null;
    this.positionVBO = null;
    this.color = null;
    this.colorStride = null;
    this.colorVBO = null;
    this.startTime = null;
    this.vs = null;
    this.fs = null;
    this.isRender = false;
    this.dots = 3; // 多角形の初期頂点
    this.radius = 0.3; // 多角形の半径
    this.render = this.render.bind(this);
    this.gui()
  }

  init() {
    this.canvas = document.getElementById('webgl-canvas');
    this.gl = WebGLUtility.createWebGLContext(this.canvas);
    const size = Math.min(window.innerWidth, window.innerHeight);
    this.canvas.width  = size;
    this.canvas.height = size;
  }

  load() {
    return new Promise((resolve, reject) => {
      // 変数に WebGL コンテキストを代入しておく（コード記述の最適化）
      const gl = this.gl;
      // WebGL コンテキストがあるかどうか確認する
      if (gl == null) {
        // もし WebGL コンテキストがない場合はエラーとして Promise を reject する
        const error = new Error('not initialized');
        reject(error);
      } else {
        this.vs = WebGLUtility.createShaderObject(gl, vertex, gl.VERTEX_SHADER);
        this.fs = WebGLUtility.createShaderObject(gl, fragment, gl.FRAGMENT_SHADER);
        this.program = WebGLUtility.createProgramObject(gl, this.vs, this.fs);
        resolve();
      }
    });
  }

  setupGeometry() {
    // 各頂点間の角度のステップ値
    const angleStep = (2.0 * Math.PI) / this.dots;

    // 頂点位置と色の配列を初期化
    this.position = [];
    this.color = [];

    // 各頂点についてループ
    for (let i = 0; i < this.dots; i++) {
      // 現在の頂点と次の頂点の角度を計算
      let angle1 = i * angleStep + Math.PI / 2;
      let angle2 = ((i + 1) % this.dots) * angleStep + Math.PI / 2;
      // 現在の頂点と次の頂点の x, y 座標を計算
      let x1 = Math.cos(angle1) * this.radius;
      let y1 = Math.sin(angle1) * this.radius;
      let x2 = Math.cos(angle2) * this.radius;
      let y2 = Math.sin(angle2) * this.radius;

      // 現在の頂点と次の頂点を使って三角形を形成する頂点座標を配列に追加
      this.position.push(0.0, 0.0, 0.0);  // 中心点
      this.position.push(x1, y1, 0.0);  // 現在の頂点
      this.position.push(x2, y2, 0.0);  // 次の頂点

      // 各頂点の色を設定
      for (let j = 0; j < 3; j++) {
        this.color.push(...this.COLOR_RGB, 1.0);
      }
    }
    
    // 要素数は XYZ の３つ
    this.positionStride = 3;
    // VBO を生成
    this.positionVBO = WebGLUtility.createVBO(this.gl, this.position);

    // 要素数は RGBA の４つ
    this.colorStride = 4;
    // VBO を生成
    this.colorVBO = WebGLUtility.createVBO(this.gl, this.color);
  }

  setupLocation() {
    const gl = this.gl;
    // attribute location の取得
    const attPosition = gl.getAttribLocation(this.program, 'position');
    const attColor = gl.getAttribLocation(this.program, 'color');
    // attribute location の有効化
    WebGLUtility.enableAttribute(gl, this.positionVBO, attPosition, this.positionStride);
    WebGLUtility.enableAttribute(gl, this.colorVBO, attColor, this.colorStride);

    // uniform location の取得
    this.uniformLocation = {
      time: gl.getUniformLocation(this.program, 'time'),
    };
  }

  setupRendering() {
    const gl = this.gl;
    // ビューポートを設定する
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    // クリアする色を設定する（RGBA で 0.0 ～ 1.0 の範囲で指定する）
    gl.clearColor(0.1294, 0.1294, 0.1294, 1.0);
    // 実際にクリアする（gl.COLOR_BUFFER_BIT で色をクリアしろ、という指定になる）
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  start() {
    // レンダリング開始時のタイムスタンプを取得しておく
    this.startTime = Date.now();
    // レンダリングを行っているフラグを立てておく
    this.isRender = true;
    // レンダリングの開始
    this.render();
  }

  stop() {
    this.isRender = false;
  }

  render() {
    const gl = this.gl;

    // レンダリングのフラグの状態を見て、requestAnimationFrame を呼ぶか決める
    if (this.isRender === true) {
      requestAnimationFrame(this.render);
    }
    // ビューポートの設定やクリア処理は毎フレーム呼び出す
    this.setupRendering();
    // 現在までの経過時間を計算し、秒単位に変換する
    const nowTime = (Date.now() - this.startTime) * 0.001;
    // プログラムオブジェクトを選択
    gl.useProgram(this.program);

    const angle = nowTime * 0.2;
    const uniLocationAngle = gl.getUniformLocation(this.program, 'angle');
    gl.uniform1f(uniLocationAngle, angle);

    // ロケーションを指定して、uniform 変数の値を更新する（GPU に送る）
    gl.uniform1f(this.uniformLocation.time, nowTime);
    // ドローコール（描画命令）
    gl.drawArrays(gl.TRIANGLES, 0, this.position.length / this.positionStride);
  }

  update() {
    this.setupGeometry()
    this.setupLocation()
  }

  gui() {
    const gui = new GUI()
    gui
      .add(this, 'dots', this.dots, 12, 1)
      .onChange(() => this.update())
    gui
    .add(this, 'radius', this.radius, 1.0, 0.1)
    .onChange(() => this.update())
  }
}
