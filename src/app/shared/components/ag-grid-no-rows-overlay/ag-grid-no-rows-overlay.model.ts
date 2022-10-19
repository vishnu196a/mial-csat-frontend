import { INoRowsOverlayParams } from 'ag-grid-community';

export interface NoRowsOverlayComponentParams {
  noRowsMessage: string;
}

export interface NoRowsOverlayParams extends INoRowsOverlayParams, NoRowsOverlayComponentParams {}
