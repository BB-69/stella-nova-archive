import { getColorId } from "../../../scripts/color";
import type {
  ItemMeta,
  ItemOverlay,
  ItemOverlayFraction,
} from "../../../scripts/structs/item-data";
import TextBox from "../../common/text-box";

const OverlayProperty = ({
  meta,
  itemOverlay,
  editing,
  setOverlay,
}: {
  meta: ItemMeta;
  itemOverlay: ItemOverlay;
  editing: boolean;
  setOverlay?: (o: ItemOverlay) => void;
}) => {
  const applyOverlay = (newO: ItemOverlayFraction) => {
    if (!setOverlay) return;

    setOverlay({
      ...itemOverlay,
      ...newO,
    });
  };

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
          <TextBox
            text={itemOverlay.text}
            edit={{ placeholder: itemOverlay.text }}
            setText={(s) => applyOverlay({ text: s.toString() })}
          />
        </>
      )}
      {(itemOverlay.notes != null || editing) &&
        (!editing ? (
          <>
            <TextBox text={"Notes"} />
            <TextBox text={itemOverlay.notes} />
          </>
        ) : (
          <>
            <span className="text-sm flex items-center">Notes</span>
            <TextBox
              text={itemOverlay.notes}
              edit={{ placeholder: itemOverlay.notes ?? "" }}
              setText={(s) => applyOverlay({ notes: s.toString() })}
            />
          </>
        ))}
      {editing && (
        <>
          <span className="text-sm flex items-center">Position</span>
          <div className="grid grid-cols-[1fr_1fr] gap-1 w-full">
            <TextBox
              text={`${itemOverlay.bounds.x}`}
              edit={{
                placeholder: itemOverlay.bounds.x.toString(),
                num: {
                  isInt: true,
                  range: { s: 0, e: meta.width },
                },
              }}
              setText={(s) =>
                applyOverlay({
                  bounds: { ...itemOverlay.bounds, x: Number(s.toString()) },
                })
              }
            />
            <TextBox
              text={`${itemOverlay.bounds.y}`}
              edit={{
                placeholder: itemOverlay.bounds.y.toString(),
                num: {
                  isInt: true,
                  range: { s: 0, e: meta.height },
                },
              }}
              setText={(s) =>
                applyOverlay({
                  bounds: { ...itemOverlay.bounds, y: Number(s.toString()) },
                })
              }
            />
          </div>
          <span className="text-sm flex items-center">Size</span>
          <div className="grid grid-cols-[1fr_1fr] gap-1 w-full">
            <TextBox
              text={`${itemOverlay.bounds.w}`}
              edit={{
                placeholder: itemOverlay.bounds.w.toString(),
                num: {
                  isInt: true,
                  range: {
                    s: 0,
                    e: meta.width - itemOverlay.bounds.x,
                  },
                },
              }}
              setText={(s) =>
                applyOverlay({
                  bounds: { ...itemOverlay.bounds, w: Number(s.toString()) },
                })
              }
            />
            <TextBox
              text={`${itemOverlay.bounds.h}`}
              edit={{
                placeholder: itemOverlay.bounds.h.toString(),
                num: {
                  isInt: true,
                  range: {
                    s: 0,
                    e: meta.height - itemOverlay.bounds.y,
                  },
                },
              }}
              setText={(s) =>
                applyOverlay({
                  bounds: { ...itemOverlay.bounds, h: Number(s.toString()) },
                })
              }
            />
          </div>
          <span className="text-sm flex items-center">Rotate</span>
          <TextBox
            text={`${itemOverlay.rotation}`}
            edit={{
              placeholder: itemOverlay.rotation.toString(),
              num: { isInt: false, range: { s: -180, e: 180 } },
            }}
            setText={(s) =>
              applyOverlay({
                rotation: Number(s.toString()),
              })
            }
          />
          <span className="text-sm flex items-center">Shear</span>
          <TextBox
            text={`${itemOverlay.shear}`}
            edit={{
              placeholder: itemOverlay.shear.toString(),
              num: { isInt: false, range: { s: -90, e: 90 } },
            }}
            setText={(s) =>
              applyOverlay({
                shear: Number(s.toString()),
              })
            }
          />
          <span className="text-sm flex items-center">Color</span>
          <TextBox
            text={`${itemOverlay.color}`}
            edit={{
              initText: itemOverlay.color,
              placeholder: getColorId(itemOverlay.id),
              applyPlaceholder: false,
              convert: (s) => {
                if (s.length === 1 && s.indexOf("#") != 0) s = "#" + s;

                return s.toUpperCase();
              },
              check: (s) => {
                const regex = /^[0-9A-F\b\#]+$/;
                return (
                  s.substring(1).indexOf("#") == -1 &&
                  s.length < 8 &&
                  regex.test(s.toUpperCase())
                );
              },
              checkFinal: (s) => {
                if (s.length === 0) return "";
                const hex = s.substring(1);

                switch (hex.length) {
                  case 3:
                    return (
                      "#" +
                      hex
                        .split("")
                        .map((s) => s + s)
                        .join("")
                    );
                  case 6:
                    return "#" + hex;
                  default:
                    return itemOverlay.color ?? "";
                }
              },
            }}
            setText={(s) =>
              applyOverlay({
                color: s.toString(),
              })
            }
          />
        </>
      )}
    </div>
  );
};

export default OverlayProperty;
