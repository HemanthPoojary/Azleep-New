import * as React from "react";
import { cn } from "@/lib/utils";
import { GripHorizontal } from "lucide-react";

interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: React.ReactNode;
  isDraggable?: boolean;
  isResizable?: boolean;
}

export const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  ({ className, title, action, children, isDraggable, isResizable, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg",
          className
        )}
        {...props}
      >
        {(title || action) && (
          <div className="mb-6 flex items-center justify-between">
            {title && (
              <div className="flex items-center gap-2">
                {isDraggable && (
                  <div className="widget-drag-handle cursor-move opacity-0 group-hover:opacity-100">
                    <GripHorizontal className="h-4 w-4 text-gray-400" />
                  </div>
                )}
                <h2 className="text-lg font-semibold text-white">{title}</h2>
              </div>
            )}
            {action && <div>{action}</div>}
          </div>
        )}
        <div className={cn("relative", isResizable && "overflow-auto")}>
          {children}
          {isResizable && (
            <div className="react-resizable-handle react-resizable-handle-se" />
          )}
        </div>
      </div>
    );
  }
);

Widget.displayName = "Widget"; 