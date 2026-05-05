"use client";

import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import RichTextEditor from "./RichTextEditor";

interface CustomRichTextEditorProps {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  height?: string;
}

const CustomRichTextEditor = ({
  name,
  label,
  required = false,
  className,
  height = "200px",
}: CustomRichTextEditorProps) => {
  const { control, getValues } = useFormContext();

  return (
    <div className={cn(className)}>
      <Controller
        name={name}
        control={control}
        defaultValue={getValues(name) ?? ""}
        rules={required ? { required: `${label ?? name} is required` } : {}}
        render={({ field, fieldState: { error } }) => (
          <div>
            <RichTextEditor
              name={name}
              label={label ?? name}
              content={field.value ?? ""}
              onChangeHandler={(content) => field.onChange(content)}
              height={height}
            />
            {error && (
              <small className="text-red-500 text-xs mt-1 block">
                {error.message}
              </small>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CustomRichTextEditor;
