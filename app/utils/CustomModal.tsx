import React from "react";
import { Modal, Box } from "@mui/material";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  component: React.ComponentType<{
    setOpen?: (open: boolean) => void;
    setRoute?: (route: string) => void;
  }>;
  setRoute?: (route: string) => void;
  width?: string;
};

const CustomModal: React.FC<Props> = ({
  open,
  setOpen,
  setRoute,
  component: Component,
  width = "450px",
}) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none"
        sx={{ width }}
      >
        <Component setOpen={setOpen} setRoute={setRoute} />
      </Box>
    </Modal>
  );
};

export default CustomModal;
