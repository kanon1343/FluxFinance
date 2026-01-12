"use client";

import { useEffect, useRef } from "react";

import type { TickerItem } from "@/types";
import { formatChangePercent, formatPrice } from "@/lib/utils";

interface MarketTickerProps {
  items: TickerItem[];
  speed?: number;
}

export function MarketTicker({ items, speed = 30 }: MarketTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content || items.length === 0) return;

    let animationId: number;
    let position = 0;
    const contentWidth = content.scrollWidth / 2;

    const animate = () => {
      position -= speed / 60;
      if (Math.abs(position) >= contentWidth) {
        position = 0;
      }
      content.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [items, speed]);

  if (items.length === 0) {
    return null;
  }

  const renderTickerItem = (item: TickerItem, index: number) => {
    const isPositive = item.change >= 0;
    const changeColor = isPositive ? "text-green-400" : "text-red-400";

    return (
      <li
        key={`${item.symbol}-${index}`}
        className="inline-flex items-center mx-6"
      >
        <span className="font-medium text-white mr-2">{item.displayName}</span>
        <span className="text-gray-300 mr-2">
          {formatPrice(item.price, item.currency)}
        </span>
        <span className={`font-medium ${changeColor}`}>
          {formatChangePercent(item.changePercent)}
        </span>
      </li>
    );
  };

  const duplicatedItems = [...items, ...items];

  return (
    <div
      ref={containerRef}
      className="bg-gray-900 py-2 overflow-hidden whitespace-nowrap"
    >
      <ul
        ref={contentRef}
        className="inline-flex list-none m-0 p-0"
        aria-label="市場ティッカー"
      >
        {duplicatedItems.map((item, index) => renderTickerItem(item, index))}
      </ul>
    </div>
  );
}
