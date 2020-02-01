const data = require('./data/text_data.json');

module.exports = {

    musings: function (points, bodyPart) {
        let res = [];
        Object.keys(data[bodyPart]).forEach(musingText => {
            let flag = true;
            Object.keys(points).forEach(type => {
                if (data[bodyPart][musingText].requires[type] > points[type])
                    flag = false;
            });
            if (flag)
                res.push(musingText);
        });
        return res;
    },

    increasePoints: function (points, bodyPart, musing) {
        let incP = data[bodyPart][musing].increase_points;
        Object.keys(incP).forEach(point => {
            points[point] += incP[point];
        });
        return points;
    }
}