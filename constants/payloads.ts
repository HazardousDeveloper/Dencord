export const Hello = {
    op: 10,
    d: null
}

export const Heartbeat = {
    op: 1,
    d: null
}

export const Identify = {
    op: 2,
    d: {
        token: "",
        intents: 3276543,
        properties: {
            $os: "linux",
            $browser: "dencord",
            $device: "dencord"
        }
    }
}

export const Resume = {
    op: 6,
    d: {
        token: "",
        session_id: "",
        seq: 0
    }
}