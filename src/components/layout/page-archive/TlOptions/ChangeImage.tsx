import { Upload } from "lucide-react";
import type { ChangeEvent } from "react";
import ButtonInput from "../../../common/button-input";

const ChangeImage = ({
  handleImageChange,
}: {
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex flex-col gap-3 w-full h-full">
      <ButtonInput
        label="Upload Image"
        icon={<Upload />}
        htmlInput={
          <input
            className="absolute inset-0 opacity-0"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        }
      />
    </div>
  );
};

export default ChangeImage;
