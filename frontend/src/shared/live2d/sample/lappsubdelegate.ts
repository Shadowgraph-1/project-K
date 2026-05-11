// @ts-nocheck
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import * as LAppDefine from './lappdefine';
import type { Live2DLookAtPointer } from '../live2dPointerFollow';
import { LAppGlManager } from './lappglmanager';
import { LAppLive2DManager } from './lapplive2dmanager';
import { LAppPal } from './lapppal';
import { LAppTextureManager } from './lapptexturemanager';
import { LAppView } from './lappview';

/**
 * Canvasに関連する操作を取りまとめるクラス
 */
export class LAppSubdelegate {
  /**
   * コンストラクタ
   */
  public constructor() {
    this._canvas = null;
    this._glManager = new LAppGlManager();
    this._textureManager = new LAppTextureManager();
    this._live2dManager = new LAppLive2DManager();
    this._view = new LAppView();
    this._frameBuffer = null;
    this._captured = false;
    this._lookAtPointer = 'whilePressed';
    this._alwaysHoverSeeded = false;
    this._needResize = false;
  }

  /** React → настройки взгляда за курсором */
  public setPointerFollow(mode: Live2DLookAtPointer): void {
    const prev = this._lookAtPointer;
    this._lookAtPointer = mode;

    if (mode !== 'always') {
      this._alwaysHoverSeeded = false;
    }

    if (mode === 'off' || (prev === 'always' && mode !== 'always')) {
      this._live2dManager?.onDrag(0.0, 0.0);
    }
  }

  /**
   * デストラクタ相当の処理
   */
  public release(): void {
    if (this._resizeObserver && this._canvas) {
      this._resizeObserver.unobserve(this._canvas);
      this._resizeObserver.disconnect();
    }
    this._resizeObserver = null;

    this._live2dManager?.release();
    this._live2dManager = null;

    this._view?.release();
    this._view = null;

    this._textureManager?.release();
    this._textureManager = null;

    this._glManager?.release();
    this._glManager = null;
  }

  /**
   * APPに必要な物を初期化する。
   */
  public initialize(canvas: HTMLCanvasElement): boolean {
    if (!this._glManager.initialize(canvas)) {
      return false;
    }

    this._canvas = canvas;

    if (LAppDefine.CanvasSize === 'auto') {
      this.resizeCanvas();
    } else {
      canvas.width = LAppDefine.CanvasSize.width;
      canvas.height = LAppDefine.CanvasSize.height;
    }

    this._textureManager.setGlManager(this._glManager);

    const gl = this._glManager.getGl();

    if (!this._frameBuffer) {
      this._frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    }

    // 透過設定
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // AppViewの初期化
    this._view.initialize(this);

    // フレームバッファサイズの設定
    this._live2dManager.setOffscreenSize(
      this._canvas.width,
      this._canvas.height
    );

    this._view.initializeSprite();

    this._live2dManager.initialize(this);

    this._resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[], observer: ResizeObserver) =>
        this.resizeObserverCallback.call(this, entries, observer)
    );
    this._resizeObserver.observe(this._canvas);

    return true;
  }

  /**
   * Resize canvas and re-initialize view.
   */
  public onResize(): void {
    this.resizeCanvas();
    this._view.initialize(this);
    this._view.initializeSprite();
  }

  private resizeObserverCallback(
    entries: ResizeObserverEntry[],
    observer: ResizeObserver
  ): void {
    if (LAppDefine.CanvasSize === 'auto') {
      this._needResize = true;
    }
  }

  /**
   * ループ処理
   */
  public update(): void {
    if (this._glManager.getGl().isContextLost()) {
      return;
    }

    // キャンバスのサイズが変わっている場合はリサイズに必要な処理をする。
    if (this._needResize) {
      this.onResize();
      this._needResize = false;
    }

    const gl = this._glManager.getGl();

    // 画面の初期化
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // 深度テストを有効化
    gl.enable(gl.DEPTH_TEST);

    // 近くにある物体は、遠くにある物体を覆い隠す
    gl.depthFunc(gl.LEQUAL);

    // カラーバッファや深度バッファをクリアする
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearDepth(1.0);

    // 透過設定
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // 描画更新
    this._view.render();
  }

  /**
   * シェーダーを登録する。
   */
  public createShader(): WebGLProgram {
    const gl = this._glManager.getGl();

    // バーテックスシェーダーのコンパイル
    const vertexShaderId = gl.createShader(gl.VERTEX_SHADER);

    if (vertexShaderId == null) {
      LAppPal.printMessage('failed to create vertexShader');
      return null;
    }

    const vertexShader: string =
      'precision mediump float;' +
      'attribute vec3 position;' +
      'attribute vec2 uv;' +
      'varying vec2 vuv;' +
      'void main(void)' +
      '{' +
      '   gl_Position = vec4(position, 1.0);' +
      '   vuv = uv;' +
      '}';

    gl.shaderSource(vertexShaderId, vertexShader);
    gl.compileShader(vertexShaderId);

    // フラグメントシェーダのコンパイル
    const fragmentShaderId = gl.createShader(gl.FRAGMENT_SHADER);

    if (fragmentShaderId == null) {
      LAppPal.printMessage('failed to create fragmentShader');
      return null;
    }

    const fragmentShader: string =
      'precision mediump float;' +
      'varying vec2 vuv;' +
      'uniform sampler2D texture;' +
      'void main(void)' +
      '{' +
      '   gl_FragColor = texture2D(texture, vuv);' +
      '}';

    gl.shaderSource(fragmentShaderId, fragmentShader);
    gl.compileShader(fragmentShaderId);

    // プログラムオブジェクトの作成
    const programId = gl.createProgram();
    gl.attachShader(programId, vertexShaderId);
    gl.attachShader(programId, fragmentShaderId);

    gl.deleteShader(vertexShaderId);
    gl.deleteShader(fragmentShaderId);

    // リンク
    gl.linkProgram(programId);
    gl.useProgram(programId);

    return programId;
  }

  public getTextureManager(): LAppTextureManager {
    return this._textureManager;
  }

  public getFrameBuffer(): WebGLFramebuffer {
    return this._frameBuffer;
  }

  public getCanvas(): HTMLCanvasElement {
    return this._canvas;
  }

  public getGlManager(): LAppGlManager {
    return this._glManager;
  }

  public getGl(): WebGLRenderingContext | WebGL2RenderingContext {
    return this._glManager.getGl();
  }

  public getLive2DManager(): LAppLive2DManager {
    return this._live2dManager;
  }

  /**
   * Resize the canvas to fill the screen.
   */
  private resizeCanvas(): void {
    this._canvas.width = this._canvas.clientWidth * window.devicePixelRatio;
    this._canvas.height = this._canvas.clientHeight * window.devicePixelRatio;

    const gl = this._glManager.getGl();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }

  /**
   * マウスダウン、タッチダウンしたときに呼ばれる。
   */
  public onPointBegan(clientX: number, clientY: number): void {
    if (!this._view) {
      LAppPal.printMessage('view notfound');
      return;
    }

    if (!this.isClientOverCanvas(clientX, clientY)) {
      return;
    }

    const { lx, ly } = this.clientToCanvasLocal(clientX, clientY);
    this._captured = true;
    if (this._lookAtPointer === 'always') {
      this._alwaysHoverSeeded = true;
    }
    this._view.onTouchesBegan(lx, ly);
  }

  /**
   * マウスポインタが動いたら呼ばれる。
   */
  public onPointMoved(clientX: number, clientY: number): void {
    if (!this._view) {
      return;
    }

    if (this._lookAtPointer === 'off') {
      return;
    }

    const inside = this.isClientOverCanvas(clientX, clientY);
    const { lx, ly } = this.clientToCanvasLocal(clientX, clientY);

    if (this._lookAtPointer === 'whilePressed') {
      if (!this._captured) {
        return;
      }

      if (!inside) {
        return;
      }

      this._view.onTouchesMoved(lx, ly);
      return;
    }

    if (this._captured) {
      if (!inside) {
        return;
      }

      this._view.onTouchesMoved(lx, ly);
      return;
    }

    if (!inside) {
      if (this._alwaysHoverSeeded) {
        this._alwaysHoverSeeded = false;
        this._live2dManager?.onDrag(0.0, 0.0);
      }

      return;
    }

    if (!this._alwaysHoverSeeded) {
      this._view.onTouchesBegan(lx, ly);
      this._alwaysHoverSeeded = true;
    }

    this._view.onTouchesMoved(lx, ly);
  }

  /**
   * クリックが終了したら呼ばれる。
   */
  public onPointEnded(clientX: number, clientY: number): void {
    const wasCaptured = this._captured;
    this._captured = false;

    if (this._lookAtPointer === 'always') {
      this._alwaysHoverSeeded = false;
    }

    if (!this._view) {
      LAppPal.printMessage('view notfound');
      return;
    }

    if (!wasCaptured) {
      return;
    }

    const { lx, ly } = this.clientToCanvasLocal(clientX, clientY);
    this._view.onTouchesEnded(lx, ly);
  }

  /**
   * タッチがキャンセルされると呼ばれる。
   */
  public onTouchCancel(clientX: number, clientY: number): void {
    const wasCaptured = this._captured;
    this._captured = false;

    if (this._lookAtPointer === 'always') {
      this._alwaysHoverSeeded = false;
    }

    if (!this._view) {
      LAppPal.printMessage('view notfound');
      return;
    }

    if (!wasCaptured) {
      return;
    }

    const { lx, ly } = this.clientToCanvasLocal(clientX, clientY);
    this._view.onTouchesEnded(lx, ly);
  }

  private clientToCanvasLocal(
    clientX: number,
    clientY: number,
  ): { lx: number; ly: number } {
    const r = this._canvas.getBoundingClientRect();
    return { lx: clientX - r.left, ly: clientY - r.top };
  }

  private isClientOverCanvas(clientX: number, clientY: number): boolean {
    const r = this._canvas.getBoundingClientRect();
    return (
      clientX >= r.left &&
      clientX < r.right &&
      clientY >= r.top &&
      clientY < r.bottom
    );
  }

  public isContextLost(): boolean {
    return this._glManager.getGl().isContextLost();
  }

  private _canvas: HTMLCanvasElement;

  /**
   * View情報
   */
  private _view: LAppView;

  /**
   * テクスチャマネージャー
   */
  private _textureManager: LAppTextureManager;
  private _frameBuffer: WebGLFramebuffer;
  private _glManager: LAppGlManager;
  private _live2dManager: LAppLive2DManager;

  /**
   * ResizeObserver
   */
  private _resizeObserver: ResizeObserver;

  /**
   * クリックしているか
   */
  private _captured: boolean;

  /** Режим взгляда за указателем (React). */
  private _lookAtPointer: Live2DLookAtPointer;
  /** В режиме always без зажатия кнопки: уже выполнен синтетический touchesBegan. */
  private _alwaysHoverSeeded: boolean;

  private _needResize: boolean;
}
