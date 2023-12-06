import React, { useEffect, useRef } from 'react';
import { Card } from 'antd';
import type { CardProps } from 'antd';
import styled from 'styled-components';

const CardContainer = styled(Card)`
  position: relative;
  z-index: 1;
  min-width: 300px;
  min-height: 50px;
  color: #fff;
  background-color: transparent;
  overflow: hidden; // 超出特效的区域隐藏掉
  cursor: pointer;

  &:hover:after {
    width: 250px;
    height: 250px;
    left: var(--x);
    top: var(--y);
  }

  /* 鼠标hover光晕渐变 */
  &:after {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 6;
    transform: rotateX(-0.03deg) rotateY(-0.03deg) translate(-50%, -50%);
    transition:
      width 0.2s ease,
      height 0.2 ease;
    width: 0;
    height: 0;
    opacity: 0.7;
    content: '';
    background: radial-gradient(circle closest-side, #133b71, transparent);
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 5;
  width: 100%;
  height: 100%;
`;

const HoverCard = React.memo<CardProps>((props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { children, ...restProps } = props;

  useEffect(() => {
    const containerRef = ref.current;
    const handleMouseMove = (event: MouseEvent) => {
      const targetRect = (event?.target as Element)?.getBoundingClientRect();
      if (!targetRect || !containerRef) return;
      const xPosition = event.clientX - targetRect.left;
      const yPosition = event.clientY - targetRect.top;
      containerRef.style.setProperty('--x', xPosition + 'px');
      containerRef.style.setProperty('--y', yPosition + 'px');
    };
    containerRef?.addEventListener('mousemove', handleMouseMove);
    return () => {
      containerRef?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={ref} style={{ display: 'inline-block', flex: 1 }}>
      <CardContainer {...restProps}>
        <Content>{children}</Content>
      </CardContainer>
    </div>
  );
});

export default HoverCard;
