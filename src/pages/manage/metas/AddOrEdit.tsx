import {
  Button,
  Checkbox,
  Switch as HopeSwitch,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Flex,
  Textarea,
  FormHelperText,
} from "@hope-ui/solid";
import { MaybeLoading, FolderChooseInput } from "~/components";
import { useFetch, useRouter, useT } from "~/hooks";
import { handleRresp, notify, r } from "~/utils";
import { Resp, Meta } from "~/types";
import { createStore } from "solid-js/store";
import { For, Show } from "solid-js";

type ItemProps = {
  name: string;
  onSub: (val: boolean) => void;
  help?: boolean;
} & (
  | { type: "string"; value: string; onChange: (val: string) => void }
  | { type: "text"; value: string; onChange: (val: string) => void }
  | { type: "bool"; value: boolean; onChange: (val: boolean) => void }
);
const Item = (props: ItemProps) => {
  const t = useT();
  return (
    <FormControl w="$full" display="flex" flexDirection="column">
      <FormLabel for={props.name} display="flex" alignItems="center">
        {t(`metas.${props.name}`)}
      </FormLabel>
      <Flex
        w="$full"
        direction={
          props.type === "bool" ? "row" : { "@initial": "column", "@md": "row" }
        }
        gap="$2"
      >
        {props.type === "string" ? (
          <Input
            id={props.name}
            value={props.value}
            onInput={(e) => props.onChange(e.currentTarget.value)}
          />
        ) : props.type === "bool" ? (
          <HopeSwitch
            id={props.name}
            defaultChecked={props.value}
            onChange={(e: any) => props.onChange(e.currentTarget.checked)}
          />
        ) : (
          <Textarea
            id={props.name}
            value={props.value}
            onChange={(e) => props.onChange(e.currentTarget.value)}
          />
        )}
        <FormControl w="fit-content" display="flex">
          <Checkbox
            css={{ whiteSpace: "nowrap" }}
            id={`${props.name}_sub`}
            onChange={(e: any) => props.onSub(e.currentTarget.checked)}
            color="$neutral10"
            fontSize="$sm"
          >
            {t("metas.apply_sub")}
          </Checkbox>
        </FormControl>
      </Flex>
      <Show when={props.help}>
        <FormHelperText>{t(`metas.${props.name}_help`)}</FormHelperText>
      </Show>
    </FormControl>
  );
};

const AddOrEdit = () => {
  const t = useT();
  const { params, back } = useRouter();
  const { id } = params;
  const [meta, setMeta] = createStore<Meta>({
    id: 0,
    path: "",
    password: "",
    p_sub: false,
    write: false,
    w_sub: false,
    hide: "",
    h_sub: false,
    readme: "",
    r_sub: false,
  });
  const [metaLoading, loadMeta] = useFetch(() =>
    r.get(`/admin/meta/get?id=${id}`)
  );

  const initEdit = async () => {
    const resp: Resp<Meta> = await loadMeta();
    handleRresp(resp, setMeta);
  };
  if (id) {
    initEdit();
  }
  const [okLoading, ok] = useFetch(() => {
    return r.post(`/admin/meta/${id ? "update" : "create"}`, meta);
  });
  return (
    <MaybeLoading loading={metaLoading()}>
      <VStack w="$full" alignItems="start" spacing="$2">
        <Heading>{t(`global.${id ? "edit" : "add"}`)}</Heading>
        <FormControl w="$full" display="flex" flexDirection="column" required>
          <FormLabel for="path" display="flex" alignItems="center">
            {t(`metas.path`)}
          </FormLabel>
          <FolderChooseInput
            id="path"
            value={meta.path}
            onChange={(path) => setMeta("path", path)}
          />
        </FormControl>
        {/* <FormControl w="$full" display="flex" flexDirection="column" required>
          <FormLabel for="password" display="flex" alignItems="center">
            {t(`metas.password`)}
          </FormLabel>
          <Input
            id="password"
            placeholder="********"
            value={meta.password}
            onInput={(e) => setMeta("password", e.currentTarget.value)}
          />
        </FormControl> */}
        <For
          each={[
            { name: "password", type: "string" },
            { name: "write", type: "bool" },
            { name: "hide", type: "text", help: true },
            { name: "readme", type: "text", help: true },
          ]}
        >
          {(item) => (
            // @ts-ignore
            <Item
              name={item.name}
              type={item.type as "string" | "bool" | "text"}
              value={meta[item.name as keyof Meta] as string | boolean}
              onChange={(val: any): void =>
                setMeta(item.name as keyof Meta, val)
              }
              onSub={(val: boolean): void =>
                setMeta(`${item.name[0]}_sub` as keyof Meta, val)
              }
              help={item.help}
            />
          )}
        </For>
        <Button
          loading={okLoading()}
          onClick={async () => {
            const resp: Resp<{}> = await ok();
            // TODO mybe can use handleRrespWithNotifySuccess
            handleRresp(resp, () => {
              notify.success(t("global.save_success"));
              back();
            });
          }}
        >
          {t(`global.${id ? "save" : "add"}`)}
        </Button>
      </VStack>
    </MaybeLoading>
  );
};

export default AddOrEdit;
