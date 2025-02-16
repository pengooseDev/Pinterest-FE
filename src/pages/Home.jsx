import styled from 'styled-components';
import DEVICES from 'styles/mediaQuery';
import { useLayoutEffect } from 'react';
import ShuffleIcon from 'assets/icons/Shuffle';
import useSound from 'use-sound';
import downSFX from 'assets/audio/down.mp3';
import upLightSFX from 'assets/audio/upLight.mp3';
import cardMount from 'libs/animations/cardMount';
import GSAP from 'constants/gsap';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchValue } from 'redux/modules/searchSlicer';
import { overlayToggle } from 'redux/modules/overlayToggle';
import { setBoxData } from 'redux/modules/boxDataSlicer';
import OverlayBox from 'components/OverlayBox';
import { motion } from 'framer-motion';
import EndData from 'components/EndData';
import SavedBoard from 'components/SavedBoard';
import Saved from 'assets/icons/Saved';
import { savedToggle } from 'redux/modules/savedToggleSlicer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [shuffleDown] = useSound(downSFX);
  const [shuffleUp] = useSound(upLightSFX);
  const pins = useSelector((state) => state.searchSlicer);
  const overlayToggleState = useSelector((state) => state.overlaySlicer);
  const boxData = useSelector((state) => state.boxDataSlicer);
  const dispatch = useDispatch();
  const onObserve = useSelector((state) => state.observeSlicer);
  const isOpen = useSelector(({ savedSlicer }) => savedSlicer);
  const navigate = useNavigate();

  const SaveToggle = () => {
    dispatch(savedToggle());
  };

  const shuffle = () => {
    shuffleUp();
    if (!pins) return;
    dispatch(setSearchValue([...pins].sort(() => Math.random() - 0.5)));
  };

  useLayoutEffect(() => {
    if (!pins[0]) return;
    cardMount();
  }, [pins]);

  const cardOpenHandler = (v) => {
    dispatch(overlayToggle());
    dispatch(setBoxData(v));
  };

  const cardCloseHandler = () => {
    dispatch(overlayToggle());
  };

  return (
    <Container>
      {overlayToggleState && (
        <OverlayWrapper>
          <Overlay
            variants={overlayVariants}
            initial="from"
            animate="to"
            exit="exit"
            onClick={cardCloseHandler}
          ></Overlay>
          <OverlayBox data={boxData} />
        </OverlayWrapper>
      )}

      <ShuffleWrapper onMouseDown={shuffleDown} onClick={shuffle}>
        <ShuffleIcon />
      </ShuffleWrapper>

      <SavedWrapper onClick={SaveToggle}>
        <Saved isOpen={isOpen} />
      </SavedWrapper>
      {isOpen ? <SavedBoard /> : null}

      <Wrapper>
        {pins
          ? [...pins].map((v, i) => {
              const { pinId, imageUrl } = v;

              return (
                <Card
                  onClick={() => {
                    if (localStorage.getItem('userInfo'))
                      return cardOpenHandler(v);

                    toast.success('로그인을 해주세요!');
                    setTimeout(() => {
                      navigate('/login');
                    }, 500);
                  }}
                  data={v}
                  className={GSAP.CARD.CARD_CLASSNAME}
                  key={`${pinId}_${i}`}
                >
                  <Image src={imageUrl} />
                </Card>
              );
            })
          : ''}
        {onObserve ? <EndData /> : ''}
      </Wrapper>
    </Container>
  );
};

export default Home;

const overlayVariants = {
  from: { opacity: 0 },
  to: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const Container = styled.div`
  position: relative;
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const OverlayWrapper = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 88px);
  margin-top: 88px;
`;
const Overlay = styled(motion.div)`
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  :hover {
    cursor: pointer;
  }
`;

const Image = styled.img`
  opacity: 0.85;
  display: inline-block;
  width: 100%;
  height: ${({ height }) => (height ? `${height}px` : 'auto')};
  break-inside: avoid;
  margin-bottom: 10px;
  min-width: 200px;
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.35);
  transition: ${({ theme }) => theme.transitionOption};

  :hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.55);
    transform: scale(1.02);
    opacity: 1;
    cursor: pointer;
  }
`;

const Card = styled(motion.div)``;

const Wrapper = styled.div`
  position: relative;
  margin-top: 88px;
  padding: 10px;
  overflow: auto;
  width: 100%;

  @media ${DEVICES.MOBILES} {
    column-count: 2;
  }

  @media ${DEVICES.MOBILEM} {
    column-count: 3;
  }

  @media ${DEVICES.MOBILEL} {
    column-count: 3;
  }

  @media ${DEVICES.TABLET} {
    column-count: 4;
  }

  @media ${DEVICES.LAPTOP} {
    column-count: 5;
  }

  @media ${DEVICES.LAPTOPL} {
    column-count: 6;
  }

  @media ${DEVICES.DESKTOP} {
    column-count: 7;
  }
`;

const ShuffleWrapper = styled.div`
  position: fixed;
  left: 20px;
  bottom: 10px;
  z-index: 2;
  background: white;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  transition: ${({ theme }) => theme.transitionOption};
  background: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.background};
  :hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.55);
    transform: scale(1.02);
    opacity: 1;
    cursor: pointer;
  }
`;

const SavedWrapper = styled.div`
  position: fixed;
  right: 20px;
  bottom: 10px;
  z-index: 2;
  background: white;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  transition: ${({ theme }) => theme.transitionOption};
  background: ${({ theme }) => theme.color};
  color: ${({ theme }) => theme.background};
  :hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.55);
    transform: scale(1.02);
    opacity: 1;
    cursor: pointer;
  }
`;
