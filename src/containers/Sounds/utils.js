import { MAP_SCALE_FACTOR, TSNE_CONFIG, DEFAULT_DESCRIPTOR }
  from 'constants';
import { readObjectPropertyByPropertyAbsName } from 'utils/objectUtils';
import tsnejs from 'vendors/tsne';
import sassVariables from 'stylesheets/variables.json';


export const computeSoundGlobalPosition = (tsnePosition, spacePosition, mapPosition) => {
  const { translateX, translateY, scale } = mapPosition;
  const cx = ((tsnePosition.x + (window.innerWidth / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * scale * spacePosition.x) + translateX;
  const cy = ((tsnePosition.y + (window.innerHeight / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * scale * spacePosition.y) + translateY;
  return { cx, cy };
};

export const thumbnailMapPosition = { translateX: 0, translateY: 0, scale: 0.3 };
export const thumbnailSize = () => {
  const { sidebarWidth, sidebarClosedOffset, sidebarContentPadding, thumbnailHeight }
    = sassVariables;
  return {
    width: parseInt(sidebarWidth, 10) - parseInt(sidebarClosedOffset, 10) -
    (2 * (parseInt(sidebarContentPadding, 10))),
    height: parseInt(thumbnailHeight, 10),
  };
};

export const getTrainedTsne = (sounds, queryParams) => {
  const tsne = new tsnejs.Tsne(TSNE_CONFIG);
  const descriptor = queryParams.descriptor || DEFAULT_DESCRIPTOR;
  const descriptorKey = `analysis.${descriptor}`;
  const trainingData = Object.keys(sounds).map(
    soundID => readObjectPropertyByPropertyAbsName(sounds[soundID], descriptorKey));
  tsne.initDataRaw(trainingData);
  return tsne;
};

const getSoundSpacePosition = (sound, store) => {
  const { spaces } = store.spaces;
  // find the space to which sound belongs to
  const space = spaces.find(curSpace => curSpace.queryID === sound.queryID);
  return space.position;
};

export const computePointsPositionInSolution = (tsne, sounds, store) => {
  const tsneSolution = tsne.getSolution();
  return Object.keys(sounds).reduce((curState, curSoundID, curIndex) => {
    const sound = sounds[curSoundID];
    const mapPosition = store.map;
    let { spacePosition } = sound;
    if (!spacePosition) {
      spacePosition = getSoundSpacePosition(sound, store);
    }
    const tsnePosition = {
      x: tsneSolution[curIndex][0],
      y: tsneSolution[curIndex][1],
    };
    const position = computeSoundGlobalPosition(tsnePosition, spacePosition, mapPosition);
    return Object.assign({}, curState, {
      [curSoundID]: {
        position,
        spacePosition, // tsne and spacePosition could be useful later (e.g.: when user moves map)
        tsnePosition,
      },
    });
  }, {});
};

export const isSoundInsideScreen = (position, isThumbnail = false) => {
  if (!position) {
    return false;
  }
  const thumbSize = thumbnailSize();
  const circleDiameter = parseInt(sassVariables.mapCircles.defaultRadius, 10) * 2;
  const screenWidth = (isThumbnail) ? thumbSize.width : window.innerWidth;
  const screenHeight = (isThumbnail) ? thumbSize.height : window.innerHeight;
  const isVerticallyOutOfScreen = (position.cy < -circleDiameter
    || position.cy > screenHeight + circleDiameter);
  const isHorizontallyOutOfScreen = (position.cx < -circleDiameter
    || position.cx > screenWidth + circleDiameter);
  return !(isVerticallyOutOfScreen || isHorizontallyOutOfScreen);
};
