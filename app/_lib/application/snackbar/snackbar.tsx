import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, SnackbarProps, Slide } from "@mui/material";

interface SnackbarMessage {
  message: string;
  options?: Omit<SnackbarProps, "open" | "message" | "action">;
  key: any;
  severity?: "error" | "warning" | "info" | "success";
  action?: (({ close }: { close: () => void }) => ReactNode) | ReactNode;
}

interface SnackbarContextType {
  addSnackbar: (message: SnackbarMessage) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

const defaultAutoHideDuration = 6000;

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  const addSnackbar = (snackbar: SnackbarMessage) => {
    setSnackbars((prev) => [...prev, snackbar]);
  };

  const handleClose = (
    _e: React.SyntheticEvent | Event | null,
    reason: string,
    key: any
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.key !== key));
  };

  return (
    <SnackbarContext.Provider value={{ addSnackbar }}>
      {children}
      {snackbars.map((snackbar) =>
        snackbar.severity ? (
          <Snackbar
            key={snackbar.key}
            open
            TransitionComponent={Slide}
            autoHideDuration={
              snackbar.options?.autoHideDuration || defaultAutoHideDuration
            }
            onClose={(e, r) => handleClose(e, r, snackbar.key)}
            {...snackbar.options}
          >
            <Alert
              onClose={(e) => handleClose(e, "timeout", snackbar.key)}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        ) : (
          <Snackbar
            key={snackbar.key}
            TransitionComponent={Slide}
            message={snackbar.message}
            open
            autoHideDuration={
              snackbar.options?.autoHideDuration || defaultAutoHideDuration
            }
            onClose={(e, r) => handleClose(e, r, snackbar.key)}
            action={
              typeof snackbar.action === "function"
                ? snackbar.action({
                    close: () => handleClose(null, "caller", snackbar.key),
                  })
                : snackbar.action
            }
            {...snackbar.options}
          />
        )
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return { addSnackbar: context.addSnackbar };
};
