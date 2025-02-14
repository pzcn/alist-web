import { Menu, Item } from "solid-contextmenu";
import { useCopyUrl, useT } from "~/hooks";
import "solid-contextmenu/dist/style.css";
import { HStack, Icon, Text, useColorMode } from "@hope-ui/solid";
import { operations } from "../toolbar/operations";
import { For } from "solid-js";
import { bus } from "~/utils";
import { Obj, UserMethods, UserPermissions } from "~/types";
import { user } from "~/store";

const ItemContent = (props: { name: string }) => {
  const t = useT();
  return (
    <HStack spacing="$2">
      <Icon
        p={operations[props.name].p ? "$1" : undefined}
        as={operations[props.name].icon}
        boxSize="$7"
        color={operations[props.name].color}
      />
      <Text>{t(`home.toolbar.${props.name}`)}</Text>
    </HStack>
  );
};

export const ContextMenu = () => {
  const { colorMode } = useColorMode();
  const { copyRawUrl, copyPreviewPage } = useCopyUrl();
  return (
    <Menu
      id={1}
      animation="scale"
      theme={colorMode() !== "dark" ? "light" : "dark"}
    >
      <For each={["rename", "move", "copy", "delete"]}>
        {(name) => (
          <Item
            hidden={() => {
              const index = UserPermissions.findIndex((item) => item === name);
              return !UserMethods.can(user(), index);
            }}
            onClick={() => {
              bus.emit("tool", name);
            }}
          >
            <ItemContent name={name} />
          </Item>
        )}
      </For>
      <Item
        onClick={({ props }) => {
          if (props.is_dir) {
            copyPreviewPage();
          } else {
            copyRawUrl(true);
          }
        }}
      >
        <ItemContent name="copy_url" />
      </Item>
    </Menu>
  );
};
