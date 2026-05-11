// @ts-nocheck
/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { ICubismUpdater, CubismUpdateOrder } from './icubismupdater';
import { CubismModel } from '../model/cubismmodel';
import { CubismEyeBlink } from '../effect/cubismeyeblink';

/**
 * Updater for eye blink effects.
 * Handles the management of eye blink animation through the CubismEyeBlink class.
 */
export class CubismEyeBlinkUpdater extends ICubismUpdater {
  private _eyeBlink: CubismEyeBlink;

  /**
   * @param eyeBlink CubismEyeBlink instance
   * @param executionOrder Optional update order override
   */
  constructor(eyeBlink: CubismEyeBlink, executionOrder?: number) {
    super(executionOrder ?? CubismUpdateOrder.CubismUpdateOrder_EyeBlink);
    this._eyeBlink = eyeBlink;
  }

  /**
   * Update process.
   *
   * @param model Model to update
   * @param deltaTimeSeconds Delta time in seconds.
   */
  onLateUpdate(model: CubismModel, deltaTimeSeconds: number): void {
    if (!model) {
      return;
    }

    // Run automatic blink alongside motion clips. Idle motion still advances each
    // frame, so tying blink to "_motionUpdated" would suppress blink entirely.
    this._eyeBlink.updateParameters(model, deltaTimeSeconds);
  }
}

// Namespace definition for compatibility.
import * as $ from './cubismeyeblinkupdater';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismFramework {
  export const CubismEyeBlinkUpdater = $.CubismEyeBlinkUpdater;
  export type CubismEyeBlinkUpdater = $.CubismEyeBlinkUpdater;
}
