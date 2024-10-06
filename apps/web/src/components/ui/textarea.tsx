import React, { useState } from "react";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, value, onChange, ...props }, ref) => {
        const wordLimit = 1;

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const words = e.target.value.split(/\s+/);
            if (words.length <= wordLimit) {
                onChange && onChange(e);
            }
        };

        return (
            <textarea
                className={
                    "flex min-h-[60px] border-[0.5px] border-[#888888] rounded-xl bg-[#6D6477] w-full px-3 py-2 text-sm shadow-sm " +
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed " +
                    "disabled:opacity-50 " +
                    className
                }
                value={value}
                onChange={handleChange}
                ref={ref}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";

export { Textarea };
