import _ from "lodash";

interface LoDashMixins extends _.LoDashStatic {
  deeply: any;
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

export default <LoDashMixins>_;
