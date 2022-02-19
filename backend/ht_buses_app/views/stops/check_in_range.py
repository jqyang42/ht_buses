# checkStudentsInRange = () => {
#         for (let i = 0; i < this.state.markers.length; i++) {
#             for (let j = 0; j < this.stops.length; j++) {
#                 if (
#                     // TODO: change condition to be if students in_range attribute is false
#                     true
#                 ) {
#                     const stopLatRadians = this.stops[j].lat / (180/Math.PI)
#                     const stopLngRadians = this.stops[j].lng / (180/Math.PI)
#                     const studentLatRadians = this.state.markers[i].position.lat / (180/Math.PI)
#                     const studentLngRadians = this.state.markers[i].position.lng / (180/Math.PI)

#                     // Haversine formula
#                     let dlng = stopLngRadians - studentLngRadians
#                     let dlat = stopLatRadians - studentLatRadians
#                     let a = Math.pow(Math.sin(dlat / 2), 2)
#                             + Math.cos(studentLatRadians) * Math.cos(stopLatRadians)
#                             * Math.pow(Math.sin(dlng / 2),2)
#                     let c = 2 * Math.asin(Math.sqrt(a))
#                     let r = 6371 // Radius of earth in kilometers, use 3956 for miles
#                     let dist = c * r

#                     console.log(dist)

#                     if (dist <= 0.4828032) {
#                         // update students in_range attribute to be true
#                     }
#                 }
#             }
#         }
#     }