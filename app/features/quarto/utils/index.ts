export {
  generateAllPieces,
  ALL_PIECES,
  getPieceById,
  getPiecesById,
  computePieceId,
  findSharedAttributes,
  hasSharedAttribute,
  getPieceAttribute,
} from './pieceAttributes';

export {
  checkLine,
  findWinningLine,
  findAllWinningLines,
  hasQuarto,
  isBoardFull,
  getEmptyPositions,
  getPlacedPieceCount,
  createEmptyBoard,
  isValidPlacement,
  positionToCoords,
  coordsToPosition,
  type LineCheckResult,
} from './winDetection';
