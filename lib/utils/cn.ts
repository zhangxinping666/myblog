// 样式类名合并工具 - 用于条件性地应用 Tailwind 样式
// 结合了 clsx 和 tailwind-merge 功能，提供类型安全的 className 管理

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并和条件应用样式类名
 * 功能：
 * 1. 支持条件性类名应用 (类似 clsx)
 * 2. 自动合并和去重 Tailwind 类 (类似 tailwind-merge)
 * 3. 支持数组和对象语法
 * 
 * @param inputs - 类名值，可以是多种格式
 * @returns 合并后的类名字符串
 * 
 * @example
 * // 基本用法
 * cn('px-2 py-1', 'text-red-500')
 * 
 * @example
 * // 条件性类名
 * cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class')
 * 
 * @example
 * // 对象语法
 * cn('base-class', {
 *   'active': isActive,
 *   'disabled': isDisabled,
 *   'large': size === 'lg'
 * })
 * 
 * @example
 * // 响应式条件
 * cn('flex', isVertical ? 'flex-col' : 'flex-row')
 * 
 * @example
 * // 动态类名合并
 * cn(
 *   'px-2 py-1',
 *   variant === 'primary' && 'bg-blue-500 text-white',
 *   size === 'lg' && 'px-4 py-2',
 *   className // 来自 props
 * )
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 带缓存的类名合并器
 * 适用于性能敏感的场景，通过缓存相同输入的结果提升性能
 */
const cache = new Map<string, string>();

export function cachedCn(...inputs: ClassValue[]): string {
  const key = JSON.stringify(inputs);
  
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  
  const result = cn(...inputs);
  cache.set(key, result);
  
  return result;
}

/**
 * 合并多个类名对象
 * 当需要动态构建复杂样式时非常有用
 * @param objects - 多个类名对象
 * @returns 合并后的类名字符串
 */
export function cnObj(...objects: Record<string, boolean>[]): string {
  const merged: Record<string, boolean> = {};
  
  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      if (value) {
        merged[key] = true;
      }
    }
  }
  
  return cn(merged);
}

/**
 * 条件性类名工具 - 简化条件判断
 */
export type ConditionalClass = {
  [key: string]: boolean | undefined | null | string | number;
};

/**
 * 更类型安全的条件类名构建器
 * 确保类型安全的同时提供流畅的 API
 */
export function cnIf(conditions: ConditionalClass): string {
  return cn(conditions);
}

/**
 * 创建变体样式的辅助函数
 * 适用于组件库中变体系统
 */
export interface VariantConfig<T extends Record<string, string>> {
  base?: ClassValue;
  variants?: Record<string, Record<string, ClassValue>>;
  defaultVariants?: Record<string, string>;
  compoundVariants?: Array<{
    [K in keyof T]?: T[K];
  } & { class: ClassValue }>;
}

export function variants<T extends Record<string, string>>(config: VariantConfig<T>) {
  return (props?: Partial<T> & { className?: ClassValue }) => {
    const { className, ...rest } = props || {};
    
    // 基础类名
    const classes: ClassValue[] = [config.base];
    
    // 变体类名
    if (config.variants) {
      for (const [key, variant] of Object.entries(rest)) {
        if (config.variants[key] && variant && typeof variant === 'string') {
          classes.push(config.variants[key][variant]);
        }
      }
    }
    
    // 默认变体
    if (config.defaultVariants) {
      for (const [key, variant] of Object.entries(config.defaultVariants)) {
        if (!(key in rest) && config.variants?.[key] && variant) {
          classes.push(config.variants[key][variant]);
        }
      }
    }
    
    // 复合变体
    if (config.compoundVariants) {
      for (const compound of config.compoundVariants) {
        const match = Object.entries(compound)
          .filter(([key]) => key !== 'class')
          .every(([key, value]) => (rest as Record<string, T>)[key] === value);
        
        if (match) {
          classes.push(compound.class);
        }
      }
    }
    
    // 额外的类名
    if (className) {
      classes.push(className);
    }
    
    return cn(classes);
  };
}

// 示例：按钮变体配置
export const buttonVariants = variants({
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'underline-offset-4 hover:underline text-primary',
    },
    size: {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-3 rounded-md',
      lg: 'h-11 px-8 rounded-md',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});