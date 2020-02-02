const data = require('./data/text_data.json');
const endings = require('./data/endings.json');

module.exports = {
    musings: function (points, bodyPart) {
        let res = [];
        let pointRes = {
            killer: {
                value: 0,
                musing: ''
            },
            lover: {
                value: 0,
                musing: ''
            },
            humor: {
                value: 0,
                musing: ''
            },
            conspiracy: {
                value: 0,
                musing: ''
            }
        }

        Object.keys(data[bodyPart].musings).forEach(musingText => {
            if (data[bodyPart].musings[musingText].path === 'none') {
                res.push(musingText);
            }
            else if (data[bodyPart].musings[musingText].requires === 0
                || (data[bodyPart].musings[musingText].requires >= pointRes[data[bodyPart].musings[musingText].path].value
                    && data[bodyPart].musings[musingText].requires <= points[data[bodyPart].musings[musingText].path])) {
                pointRes[data[bodyPart].musings[musingText].path].value = data[bodyPart].musings[musingText].requires;
                pointRes[data[bodyPart].musings[musingText].path].musing = musingText;
            }
        })

        if (pointRes.killer.musing !== '')
            res.push(pointRes.killer.musing);
        if (pointRes.lover.musing !== '')
            res.push(pointRes.lover.musing);
        if (pointRes.humor.musing !== '')
            res.push(pointRes.humor.musing);
        if (pointRes.conspiracy.musing !== '')
            res.push(pointRes.conspiracy.musing);
        return res;
    },

    increasePoints: function (points, bodyPart, musing) {
        let path = data[bodyPart].musings[musing].path;
        points[path]++;
        return points;
    },

    fetchMusingText: function (bodyPart, musing) {
        return data[bodyPart].musings[musing].text;
    },

    fetchArthurResponse: function (bodyPart, musing) {
        return data[bodyPart].musings[musing].arthur_response;
    },

    fetchDiscriptions: function (bodyPart) {
        return data[bodyPart].observational_text;
    },

    fetchEnding: function (points) {
        let ending = false;
        Object.keys(points).forEach(point => {
            if (points[point] >= 6)
                ending = point;
        })
        return ending;
    },

    fetchArthurMood: function (bodyPart, musing) {
        return data[bodyPart].musings[musing].arthur;
    },

    fetchEndingText: function (path) {
        return endings[path].text;
    }
}