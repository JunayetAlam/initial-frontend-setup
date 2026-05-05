"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import Image from "next/image";
import { X } from "lucide-react";

type TImageUploadProps = {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  defaultImage?: string;
  disabled?: boolean;
};

const CustomImageUpload = ({
  name,
  label,
  required,
  className,
  defaultImage,
  disabled,
}: TImageUploadProps) => {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);

  const watchedValue = watch(name);

  useEffect(() => {
    if (!watchedValue && defaultImage) {
      setPreview(defaultImage);
    }
  }, [defaultImage, watchedValue]);

  const openFilePicker = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  return (
    <div className={className}>
      <Controller
        name={name}
        rules={{ required: required ? "This field is required" : false }}
        control={control}
        render={({ field }) => (
          <div>
            {label && (
              <Label className="mb-2 block">
                {label} {required && <span className="text-red-500">*</span>}
              </Label>
            )}

            {/* IMAGE BOX */}
            <div className="flex items-center gap-4">
              <div
                onClick={openFilePicker}
                className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-md border bg-gray-100"
              >
                {/* Preview */}
                {preview ? (
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    Click to upload
                  </div>
                )}

                {/* Hover overlay hint */}
                <div className="absolute inset-0 hidden items-center justify-center bg-black/30 text-xs text-white group-hover:flex">
                  Change Image
                </div>

                {/* ❌ REMOVE BUTTON */}
                {preview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent opening file picker
                      setPreview(defaultImage || null);
                      setValue(name, null);
                      field.onChange(null);
                    }}
                    className="absolute top-1 right-1 z-10 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* hidden input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={disabled}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const fileUrl = URL.createObjectURL(file);
                  setPreview(fileUrl);
                  field.onChange(file);
                }}
              />
            </div>

            {/* Error */}
            {errors?.[name] && (
              <small className="text-red-500">
                {errors?.[name]?.message as string}
              </small>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CustomImageUpload;
