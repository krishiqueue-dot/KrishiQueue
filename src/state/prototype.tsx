import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  CROPS,
  DEFAULT_REGION_ID,
  DEMO,
  getCentre,
  getRegion,
  slotsFor,
  type CropId,
} from "@/data/india";

/**
 * A single source of truth for the whole interactive prototype.
 *
 * Every demo on the page — booking, the live queue board, the phone preview,
 * procurement tracking and payment — reads and writes this one store. That is
 * deliberate: booking a slot in one section changes the token shown in another,
 * so the prototype behaves like one product rather than a row of widgets.
 *
 * When this becomes a real application, this reducer is the piece that gets
 * replaced by API calls plus a WebSocket subscription. The component tree
 * above it does not need to change.
 */

export const PROC_STAGES = [
  "s1", // slot booked
  "s2", // checked in
  "s3", // waiting
  "s4", // weighment
  "s5", // quality check
  "s6", // procurement completed
  "s7", // payment processing
  "s8", // payment completed
] as const;

export type ProcStage = (typeof PROC_STAGES)[number];

export type Notification = {
  id: number;
  kind: "sms" | "app";
  title: string;
  body: string;
  at: string;
};

export type PrototypeState = {
  regionId: string;
  centreId: string;
  dayOffset: number;
  slotLabel: string | null;
  cropId: CropId;
  expectedQtl: number;
  /** Null until the farmer completes a booking. */
  token: string | null;
  /** Numeric part of the farmer's token, used for queue position maths. */
  tokenNumber: number;
  /** Token number currently at a counter. */
  nowServing: number;
  servedToday: number;
  stageIndex: number;
  notifications: Notification[];
  notifySeq: number;
};

const FIRST_TOKEN = 95;
const YOUR_TOKEN_NUMBER = 102;
const LAST_TOKEN = 112;

function initialState(): PrototypeState {
  const region = getRegion(DEFAULT_REGION_ID);
  return {
    regionId: region.id,
    centreId: region.centres[0].id,
    dayOffset: 0,
    slotLabel: null,
    cropId: region.primaryCrop,
    expectedQtl: 40,
    token: null,
    tokenNumber: YOUR_TOKEN_NUMBER,
    nowServing: 98,
    servedToday: region.centres[0].servedToday,
    stageIndex: 0,
    notifications: [],
    notifySeq: 1,
  };
}

type Action =
  | { type: "setRegion"; regionId: string }
  | { type: "setCentre"; centreId: string }
  | { type: "setDay"; dayOffset: number }
  | { type: "setSlot"; label: string }
  | { type: "setCrop"; cropId: CropId }
  | { type: "setQuantity"; qtl: number }
  | { type: "confirmBooking"; notify: Omit<Notification, "id"> }
  | { type: "advanceQueue"; notify?: Omit<Notification, "id"> }
  | { type: "resetQueue" }
  | { type: "advanceStage"; notify?: Omit<Notification, "id"> }
  | { type: "setStage"; index: number }
  | { type: "notify"; notify: Omit<Notification, "id"> }
  | { type: "resetAll" };

function withNotification(
  state: PrototypeState,
  notify?: Omit<Notification, "id">,
): PrototypeState {
  if (!notify) return state;
  return {
    ...state,
    notifySeq: state.notifySeq + 1,
    notifications: [{ id: state.notifySeq, ...notify }, ...state.notifications].slice(0, 8),
  };
}

function reducer(state: PrototypeState, action: Action): PrototypeState {
  switch (action.type) {
    case "setRegion": {
      const region = getRegion(action.regionId);
      return {
        ...state,
        regionId: region.id,
        centreId: region.centres[0].id,
        cropId: region.primaryCrop,
        slotLabel: null,
        token: null,
        stageIndex: 0,
        nowServing: 98,
        servedToday: region.centres[0].servedToday,
      };
    }

    case "setCentre": {
      const centre = getCentre(state.regionId, action.centreId);
      return {
        ...state,
        centreId: centre.id,
        slotLabel: null,
        servedToday: centre.servedToday,
      };
    }

    case "setDay":
      return { ...state, dayOffset: action.dayOffset, slotLabel: null };

    case "setSlot":
      return { ...state, slotLabel: action.label };

    case "setCrop":
      return { ...state, cropId: action.cropId };

    case "setQuantity":
      return { ...state, expectedQtl: action.qtl };

    case "confirmBooking":
      return withNotification(
        { ...state, token: DEMO.token, stageIndex: 0, nowServing: 98 },
        action.notify,
      );

    case "advanceQueue": {
      if (state.nowServing >= LAST_TOKEN) return state;
      const nowServing = state.nowServing + 1;
      // Once the farmer's own token is called, the procurement workflow starts.
      const stageIndex =
        nowServing >= state.tokenNumber && state.stageIndex < 3 ? 3 : state.stageIndex;
      return withNotification(
        { ...state, nowServing, servedToday: state.servedToday + 1, stageIndex },
        action.notify,
      );
    }

    case "resetQueue":
      return { ...state, nowServing: 98, servedToday: getCentre(state.regionId, state.centreId).servedToday };

    case "advanceStage": {
      if (state.stageIndex >= PROC_STAGES.length - 1) return state;
      return withNotification({ ...state, stageIndex: state.stageIndex + 1 }, action.notify);
    }

    case "setStage":
      return { ...state, stageIndex: Math.min(Math.max(action.index, 0), PROC_STAGES.length - 1) };

    case "notify":
      return withNotification(state, action.notify);

    case "resetAll":
      return initialState();

    default:
      return state;
  }
}

type PrototypeValue = ReturnType<typeof useProvideValue>;

function useProvideValue() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const region = useMemo(() => getRegion(state.regionId), [state.regionId]);
  const centre = useMemo(
    () => getCentre(state.regionId, state.centreId),
    [state.regionId, state.centreId],
  );
  const crop = CROPS[state.cropId];
  const slots = useMemo(() => slotsFor(centre, state.dayOffset), [centre, state.dayOffset]);

  /** Tokens ahead of the farmer. Zero means the counter is calling them now. */
  const position = Math.max(0, state.tokenNumber - state.nowServing);
  const estWaitMin = position * centre.avgServiceMin;
  const isComplete = state.nowServing > state.tokenNumber;

  /** The visible slice of the queue board, five tokens wide. */
  const board = useMemo(() => {
    const from = Math.max(FIRST_TOKEN, state.nowServing);
    const rows: { number: number; token: string; status: "serving" | "called" | "waiting" }[] = [];
    for (let n = from; n <= Math.min(from + 5, LAST_TOKEN); n++) {
      rows.push({
        number: n,
        token: `KQ-${n}`,
        status: n === state.nowServing ? "serving" : n === state.nowServing + 1 ? "called" : "waiting",
      });
    }
    return rows;
  }, [state.nowServing]);

  const acceptedQtl = DEMO.acceptedQtl;
  const amount = Math.round(acceptedQtl * crop.demoRate);

  const paymentStatus: "none" | "processing" | "completed" =
    state.stageIndex >= 7 ? "completed" : state.stageIndex >= 6 ? "processing" : "none";

  const setRegion = useCallback((regionId: string) => dispatch({ type: "setRegion", regionId }), []);
  const setCentre = useCallback((centreId: string) => dispatch({ type: "setCentre", centreId }), []);
  const setDay = useCallback((dayOffset: number) => dispatch({ type: "setDay", dayOffset }), []);
  const setSlot = useCallback((label: string) => dispatch({ type: "setSlot", label }), []);
  const setCrop = useCallback((cropId: CropId) => dispatch({ type: "setCrop", cropId }), []);
  const setQuantity = useCallback((qtl: number) => dispatch({ type: "setQuantity", qtl }), []);
  const setStage = useCallback((index: number) => dispatch({ type: "setStage", index }), []);
  const resetQueue = useCallback(() => dispatch({ type: "resetQueue" }), []);
  const resetAll = useCallback(() => dispatch({ type: "resetAll" }), []);

  const confirmBooking = useCallback(
    (notify: Omit<Notification, "id">) => dispatch({ type: "confirmBooking", notify }),
    [],
  );
  const advanceQueue = useCallback(
    (notify?: Omit<Notification, "id">) => dispatch({ type: "advanceQueue", notify }),
    [],
  );
  const advanceStage = useCallback(
    (notify?: Omit<Notification, "id">) => dispatch({ type: "advanceStage", notify }),
    [],
  );
  const notify = useCallback(
    (n: Omit<Notification, "id">) => dispatch({ type: "notify", notify: n }),
    [],
  );

  return {
    ...state,
    region,
    centre,
    crop,
    slots,
    board,
    position,
    estWaitMin,
    isComplete,
    acceptedQtl,
    amount,
    paymentStatus,
    stage: PROC_STAGES[state.stageIndex],
    canAdvanceQueue: state.nowServing < LAST_TOKEN,
    setRegion,
    setCentre,
    setDay,
    setSlot,
    setCrop,
    setQuantity,
    setStage,
    confirmBooking,
    advanceQueue,
    advanceStage,
    resetQueue,
    resetAll,
    notify,
  };
}

const PrototypeContext = createContext<PrototypeValue | null>(null);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const value = useProvideValue();
  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototype(): PrototypeValue {
  const ctx = useContext(PrototypeContext);
  if (!ctx) throw new Error("usePrototype must be used inside <PrototypeProvider>");
  return ctx;
}

export function nowLabel(): string {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}
