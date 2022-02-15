import _ from "lodash";

interface LoDashMixins extends _.LoDashStatic {
  deeply: any;
  deeplyOmitHeaders: any;
}

_.mixin({
  deeply: function (map) {
    return function (obj: any, fn: any) {
      return map(
        _.mapValues(obj, function (v) {
          return _.isPlainObject(v) ? (_ as any).deeply(map)(v, fn) : v;
        }),
        fn
      );
    };
  },
});

_.mixin({
  deeplyOmitHeaders: function (map) {
    return function (obj: any, fn: any) {
      return map(
        _.mapValues(obj, function (v, k) {
          return _.isPlainObject(v) && k !== "headers"
            ? (_ as any).deeplyOmitHeaders(map)(v, fn)
            : v;
        }),
        fn
      );
    };
  },
});

export default <LoDashMixins>_;
