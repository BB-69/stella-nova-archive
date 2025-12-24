import type { ItemMeta, ItemOverlay } from "../../../scripts/structs/item-data";
import TextBox from "../../common/text-box";

const OverlayProperty = ({
  meta,
  itemOverlay,
  editing,
}: {
  meta: ItemMeta;
  itemOverlay: ItemOverlay;
  editing: boolean;
}) => {
  return (
    <div className="group-selectable grid grid-cols-[60px_auto] auto-rows-[minmax(30px,auto)] gap-1">
      {!editing ? (
        <>
          <TextBox text={"Text"} />
          <TextBox text={itemOverlay.text} />
        </>
      ) : (
        <>
          <span className="text-sm flex items-center">Text</span>
          <TextBox text={itemOverlay.text} edit={{ placeholder: "null" }} />
        </>
      )}
      {itemOverlay.notes != null ||
        (editing && (
          <>
            {!editing ? (
              <>
                <TextBox text={"Notes"} />
                <TextBox text={itemOverlay.notes} />
              </>
            ) : (
              <>
                <span className="text-sm flex items-center">Notes</span>
                <TextBox text={itemOverlay.notes} edit={{ placeholder: "" }} />
              </>
            )}
          </>
        ))}
      {editing && (
        <>
          <span className="text-sm flex items-center">Position</span>
          <div className="grid grid-cols-[1fr_1fr] gap-1 w-full">
            <TextBox
              text={`${itemOverlay.bounds.x}`}
              edit={{
                placeholder: "0",
                num: {
                  isInt: true,
                  range: { s: 0, e: meta.width },
                },
              }}
            />
            <TextBox
              text={`${itemOverlay.bounds.y}`}
              edit={{
                placeholder: "0",
                num: {
                  isInt: true,
                  range: { s: 0, e: meta.height },
                },
              }}
            />
          </div>
          <span className="text-sm flex items-center">Size</span>
          <div className="grid grid-cols-[1fr_1fr] gap-1 w-full">
            <TextBox
              text={`${itemOverlay.bounds.w}`}
              edit={{
                placeholder: "0",
                num: {
                  isInt: true,
                  range: { s: itemOverlay.bounds.x, e: meta.width },
                },
              }}
            />
            <TextBox
              text={`${itemOverlay.bounds.h}`}
              edit={{
                placeholder: "0",
                num: {
                  isInt: true,
                  range: { s: itemOverlay.bounds.y, e: meta.height },
                },
              }}
            />
          </div>
          <span className="text-sm flex items-center">Rotate</span>
          <TextBox
            text={`${itemOverlay.rotation}`}
            edit={{
              placeholder: "0.0",
              num: { isInt: false, range: { s: -180, e: 180 } },
            }}
          />
          <span className="text-sm flex items-center">Shear</span>
          <TextBox
            text={`${itemOverlay.shear}`}
            edit={{
              placeholder: "0.0",
              num: { isInt: false, range: { s: -90, e: 90 } },
            }}
          />
        </>
      )}
    </div>
  );
};

export default OverlayProperty;
