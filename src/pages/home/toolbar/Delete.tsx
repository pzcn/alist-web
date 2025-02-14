import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  createDisclosure,
} from "@hope-ui/solid";
import { onCleanup } from "solid-js";
import { useFetch, usePath, useRouter, useT } from "~/hooks";
import { selectedObjs } from "~/store";
import { bus, fsRemove, handleRrespWithNotifySuccess } from "~/utils";

export const Delete = () => {
  const t = useT();
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [loading, ok] = useFetch(fsRemove);
  const { refresh } = usePath();
  const { pathname } = useRouter();
  bus.on("tool", (name) => {
    if (name === "delete") {
      onOpen();
    }
  });
  onCleanup(() => {
    bus.off("tool");
  });
  return (
    <Modal
      blockScrollOnMount={false}
      opened={isOpen()}
      onClose={onClose}
      size={{
        "@initial": "xs",
        "@md": "md",
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("home.toolbar.delete")}</ModalHeader>
        <ModalBody>
          <p>{t("home.toolbar.delete-tips")}</p>
        </ModalBody>
        <ModalFooter display="flex" gap="$2">
          <Button onClick={onClose} colorScheme="neutral">
            {t("global.cancel")}
          </Button>
          <Button
            colorScheme="danger"
            loading={loading()}
            onClick={async () => {
              const resp = await ok(
                pathname(),
                selectedObjs().map((obj) => obj.name)
              );
              handleRrespWithNotifySuccess(resp, () => {
                refresh();
                onClose();
              });
            }}
          >
            {t("global.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
