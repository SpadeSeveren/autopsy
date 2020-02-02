const data = require('./data/text_data.json');

module.exports = {

    musings: function (points, bodyPart) {
        let res = [];
        Object.keys(data[bodyPart].musings).forEach(musingText => {
            let flag = true;
            Object.keys(points).forEach(type => {
                if (data[bodyPart].musings[musingText].requires[type] > points[type])
                    flag = false;
            });
            if (flag)
                res.push(musingText);
        });
        return res;
    },

    increasePoints: function (points, bodyPart, musing) {
        let incP = data[bodyPart].musings[musing].increase_points;
        Object.keys(incP).forEach(point => {
            points[point] += incP[point];
        });
        return points;
    },

    fetchMusingText: function(bodyPart, musing) {
        return (data[bodyPart].musings[musing].text);
    },

    fetchArthurResponse: function (bodyPart, musing) {
        return (data[bodyPart].musings[musing].arthur_response);
    }
}