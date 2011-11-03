db.test.drop()
db.test.save({ v: [ {a:1}, {a:4}, {a:8} ] })
db.test.ensureIndex({ "v.a" : 1 })

query = { "v" : { $elemMatch : { "a" : { "$gte" : 3, "$lte" : 5}}}};

plan = db.test.find(query).explain();
assert.eq([[3, 1.7976931348623157e+308]], plan.indexBounds["v.a"]);

plan = db.test.find(query).hint({ $index : { $natural : 1 }  }).explain();
assert.eq({}, plan.indexBounds);

plan = db.test.find(query).hint({ $index : "v.a_1" }).explain();
assert.eq([[3, 1.7976931348623157e+308]], plan.indexBounds["v.a"]);

plan = db.test.find(query).hint({ $index : { "v.a" : 1 } }).explain();
assert.eq([[3, 1.7976931348623157e+308]], plan.indexBounds["v.a"]);

plan = db.test.find(query).hint({ $index : "v.a_1", $range : { "v.a" : true } }).explain();
assert.eq([[3, 5]], plan.indexBounds["v.a"]);
