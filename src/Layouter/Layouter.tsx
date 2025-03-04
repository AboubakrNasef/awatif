import { children, onMount, ParentComponent, Show } from "solid-js";

type LayouterProps = {
  children: any;
  hideEditor: boolean;
};

export function Layouter(props: LayouterProps) {
  let container: HTMLDivElement;
  let leftView: HTMLDivElement;
  let resizerHorizontal: HTMLDivElement;

  const c = children(() => props.children).toArray();

  onMount(() => {
    if (!props.hideEditor) {
      let x = 0;
      let dx = 0;
      let leftViewWidth = 0;

      // on pointer down
      resizerHorizontal.addEventListener("pointerdown", (e) => {
        x = e.clientX;
        leftViewWidth = leftView.getBoundingClientRect().width;

        document.addEventListener("pointermove", pointerMoveHandlerHorizontal);
      });

      // on pointer move
      const pointerMoveHandlerHorizontal = (e: PointerEvent): void => {
        dx = e.clientX - x;
        leftView.style.width = `${leftViewWidth + dx}px`;
        document.body.style.cursor = "col-resize";
        resizerHorizontal.style.cursor = "col-resize";

        container.style.userSelect = "none";
        container.style.pointerEvents = "none";
      };

      // on pointer up
      document.addEventListener("pointerup", () => {
        document.body.style.removeProperty("cursor");
        document.removeEventListener(
          "pointermove",
          pointerMoveHandlerHorizontal
        );
        container.style.removeProperty("user-select");
        container.style.removeProperty("pointer-events");
      });
    }
  });

  return (
    <div class="flex flex-col-reverse md:flex-row h-screen" ref={container!}>
      <Show
        when={props.hideEditor}
        fallback={
          <>
            <div
              class="flex flex-col w-full md:w-1/2 min-w-[350px] min-h-[200px]"
              ref={leftView!}
            >
              {c[0]}
              {c[1]}
              {c[2]}
            </div>
            <div
              class="bg-primary w-[2px] cursor-ew-resize"
              ref={resizerHorizontal!}
            ></div>
            <div class="relative flex-1 min-w-[350px]">
              {c[3]}
              {c[4]}
              {c[5]}
            </div>
          </>
        }
      >
        <div class="relative flex-1 min-w-[350px]">
          {c[3]}
          {c[4]}
          {c[5]}
        </div>
      </Show>
    </div>
  );
}
