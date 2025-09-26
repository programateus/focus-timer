export interface DialogState {
  isOpen: boolean;
  title: string | null;
  description?: string | null;
  content: React.ReactNode;
}

export interface DialogPayload {
  title: string;
  content: React.ReactNode;
  description?: string | null;
}

export type Action =
  | {
      type: "OPEN";
      payload: DialogPayload;
    }
  | {
      type: "CLOSE";
    };

export const initialState: DialogState = {
  isOpen: false,
  title: null,
  content: null,
  description: null,
};

export const dialogReducer = (
  state: DialogState,
  action: Action
): DialogState => {
  switch (action.type) {
    case "OPEN":
      return {
        ...state,
        isOpen: true,
        title: action.payload.title,
        content: action.payload.content,
      };
    case "CLOSE":
      return {
        ...state,
        isOpen: false,
        title: null,
        content: null,
        description: null,
      };
    default:
      return state;
  }
};
