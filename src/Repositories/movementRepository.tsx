import axios from "axios"
import * as dotenv from "dotenv"

dotenv.config({ path: "../.env" })
//const host = "http://localhost:8080"
const host = "https://chess001.herokuapp.com"

//const getMovements = () => axios.get(`${process.env.BASE_URL}/movements`)
export function getMovements(
    onSuccess: (newMovements: BoardMovement[]) => void,
) {
    axios
        .get(`${host}/movements`)
        .then((response) => {
            console.table(response.data)
            const newMovements = response.data as BoardMovement[]
            onSuccess(newMovements)
        })
        .catch((error) => {
            console.error("Error fetching movements", error)
        })
}

export function postMovement(movement: BoardMovement) {
    axios
        .post(`${host}/movements`, movement)
        .then((response) => {
            console.log(`Successfully added movement`)
        })
        .catch((error) => {
            console.error(error)
        })
}

export function resetMovements(onSuccess: () => void) {
    axios
        .delete(`${host}/movements`)
        .then((response) => {
            onSuccess()
            console.log("Successfully delete movements")
        })
        .catch((error) => {
            console.error(error)
        })
}

export function startEventSource(listener: (data: number) => void) {
    const eventSource = new EventSource(`${host}/sse`)
    eventSource.addEventListener("message", (event: MessageEvent) => {
        try {
            listener(parseInt(event.data))
        } catch {}
    })
}
