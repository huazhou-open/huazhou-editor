import { d as defineComponent, c as createElementBlock, a as createVNode, w as withCtx, b as createBaseVNode, e as createTextVNode, t as toDisplayString, f as createCommentVNode, r as ref, E as ElMessage, g as resolveComponent, o as openBlock, _ as _export_sfc } from "./index-BjmZCG1l.js";
const _hoisted_1 = { class: "home-container" };
const _hoisted_2 = { class: "card-header" };
const _hoisted_3 = { key: 0 };
const _hoisted_4 = { class: "card-header" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Home",
  setup(__props) {
    const clickCount = ref(0);
    const handleClick = () => {
      clickCount.value++;
      ElMessage.success(`Button clicked ${clickCount.value} times!`);
    };
    return (_ctx, _cache) => {
      const _component_ElementPlus = resolveComponent("ElementPlus");
      const _component_el_icon = resolveComponent("el-icon");
      const _component_el_button = resolveComponent("el-button");
      const _component_el_card = resolveComponent("el-card");
      const _component_el_col = resolveComponent("el-col");
      const _component_InfoFilled = resolveComponent("InfoFilled");
      const _component_el_tag = resolveComponent("el-tag");
      const _component_el_space = resolveComponent("el-space");
      const _component_el_row = resolveComponent("el-row");
      const _component_el_main = resolveComponent("el-main");
      const _component_el_container = resolveComponent("el-container");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(_component_el_container, null, {
          default: withCtx(() => [
            createVNode(_component_el_main, null, {
              default: withCtx(() => [
                createVNode(_component_el_row, { gutter: 20 }, {
                  default: withCtx(() => [
                    createVNode(_component_el_col, { span: 12 }, {
                      default: withCtx(() => [
                        createVNode(_component_el_card, { class: "welcome-card" }, {
                          header: withCtx(() => [
                            createBaseVNode("div", _hoisted_2, [
                              createVNode(_component_el_icon, null, {
                                default: withCtx(() => [
                                  createVNode(_component_ElementPlus)
                                ]),
                                _: 1
                              }),
                              _cache[0] || (_cache[0] = createBaseVNode("span", null, "Welcome", -1))
                            ])
                          ]),
                          default: withCtx(() => [
                            _cache[2] || (_cache[2] = createBaseVNode("p", null, "您的 Electron + Vue3 + Element Plus + TypeScript 项目已就绪！", -1)),
                            createVNode(_component_el_button, {
                              type: "primary",
                              onClick: handleClick
                            }, {
                              default: withCtx(() => [..._cache[1] || (_cache[1] = [
                                createTextVNode(" Click Me ", -1)
                              ])]),
                              _: 1
                            }),
                            clickCount.value > 0 ? (openBlock(), createElementBlock("p", _hoisted_3, "Clicked " + toDisplayString(clickCount.value) + " times", 1)) : createCommentVNode("", true)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_col, { span: 12 }, {
                      default: withCtx(() => [
                        createVNode(_component_el_card, { class: "info-card" }, {
                          header: withCtx(() => [
                            createBaseVNode("div", _hoisted_4, [
                              createVNode(_component_el_icon, null, {
                                default: withCtx(() => [
                                  createVNode(_component_InfoFilled)
                                ]),
                                _: 1
                              }),
                              _cache[3] || (_cache[3] = createBaseVNode("span", null, "Tech Stack", -1))
                            ])
                          ]),
                          default: withCtx(() => [
                            createVNode(_component_el_space, { wrap: "" }, {
                              default: withCtx(() => [
                                createVNode(_component_el_tag, { type: "success" }, {
                                  default: withCtx(() => [..._cache[4] || (_cache[4] = [
                                    createTextVNode("Electron", -1)
                                  ])]),
                                  _: 1
                                }),
                                createVNode(_component_el_tag, { type: "primary" }, {
                                  default: withCtx(() => [..._cache[5] || (_cache[5] = [
                                    createTextVNode("Vue 3", -1)
                                  ])]),
                                  _: 1
                                }),
                                createVNode(_component_el_tag, { type: "warning" }, {
                                  default: withCtx(() => [..._cache[6] || (_cache[6] = [
                                    createTextVNode("TypeScript", -1)
                                  ])]),
                                  _: 1
                                }),
                                createVNode(_component_el_tag, { type: "danger" }, {
                                  default: withCtx(() => [..._cache[7] || (_cache[7] = [
                                    createTextVNode("Element Plus", -1)
                                  ])]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]);
    };
  }
});
const Home = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3e3979f2"]]);
export {
  Home as default
};
