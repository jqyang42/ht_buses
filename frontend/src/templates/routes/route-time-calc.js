import { DistanceMatrixService } from "@react-google-maps/api";

function calcTime({ origin, destination }) {
    // return (
    //     <DistanceMatrixService 
    //     options={{
    //         destinations: destination, // destination should be array of lat/lng dicts
    //         origins: origin, // same as destination
    //         travelMode: "DRIVING",
    //     }}
    //     callback={(response) => updateTimes({ response: response })}
    //     />
    // )
    DistanceMatrixService(origin, destination, "DRIVING", (res, status) => {
        console.log(durations)
        console.log(status)
    })

    // https://medium.com/@chan.buena/how-to-use-google-distance-matrix-api-on-front-end-or-back-end-with-react-72d342f05733
}

function updateTimes({ response }) {
    console.log(response)
    const index = 0 // index of destination
    const travel_time = response.rows[0].elements[index].duration.text  // time to travel from origin to desitnation
}
