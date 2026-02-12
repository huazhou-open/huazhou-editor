import { d as defineComponent, c as createElementBlock, b as createBaseVNode, a as createVNode, w as withCtx, e as createTextVNode, l as reactive, E as ElMessage, g as resolveComponent, o as openBlock, _ as _export_sfc } from "./index-BjmZCG1l.js";
const _hoisted_1 = { class: "appearance-config" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AppearanceConfig",
  setup(__props) {
    const defaultConfig = {
      theme: "auto",
      fontSize: "default",
      fontFamily: "system",
      scale: "1.0"
    };
    const config = reactive({ ...defaultConfig });
    const handleSave = () => {
      ElMessage.success("配置已保存");
    };
    const handleReset = () => {
      Object.assign(config, defaultConfig);
      ElMessage.info("配置已重置");
    };
    return (_ctx, _cache) => {
      const _component_el_radio = resolveComponent("el-radio");
      const _component_el_radio_group = resolveComponent("el-radio-group");
      const _component_el_form_item = resolveComponent("el-form-item");
      const _component_el_option = resolveComponent("el-option");
      const _component_el_select = resolveComponent("el-select");
      const _component_el_button = resolveComponent("el-button");
      const _component_el_form = resolveComponent("el-form");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[9] || (_cache[9] = createBaseVNode("h2", null, "外观设置", -1)),
        createVNode(_component_el_form, {
          model: config,
          "label-width": "120px",
          class: "config-form"
        }, {
          default: withCtx(() => [
            createVNode(_component_el_form_item, { label: "主题模式" }, {
              default: withCtx(() => [
                createVNode(_component_el_radio_group, {
                  modelValue: config.theme,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => config.theme = $event)
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_radio, { label: "light" }, {
                      default: withCtx(() => [..._cache[4] || (_cache[4] = [
                        createTextVNode("浅色", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(_component_el_radio, { label: "dark" }, {
                      default: withCtx(() => [..._cache[5] || (_cache[5] = [
                        createTextVNode("深色", -1)
                      ])]),
                      _: 1
                    }),
                    createVNode(_component_el_radio, { label: "auto" }, {
                      default: withCtx(() => [..._cache[6] || (_cache[6] = [
                        createTextVNode("跟随系统", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ]),
              _: 1
            }),
            createVNode(_component_el_form_item, { label: "字体大小" }, {
              default: withCtx(() => [
                createVNode(_component_el_select, {
                  modelValue: config.fontSize,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => config.fontSize = $event)
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_option, {
                      label: "小 (12px)",
                      value: "small"
                    }),
                    createVNode(_component_el_option, {
                      label: "默认 (14px)",
                      value: "default"
                    }),
                    createVNode(_component_el_option, {
                      label: "大 (16px)",
                      value: "large"
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ]),
              _: 1
            }),
            createVNode(_component_el_form_item, { label: "字体家族" }, {
              default: withCtx(() => [
                createVNode(_component_el_select, {
                  modelValue: config.fontFamily,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => config.fontFamily = $event)
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_option, {
                      label: "系统默认",
                      value: "system"
                    }),
                    createVNode(_component_el_option, {
                      label: "微软雅黑",
                      value: "microsoft-yahei"
                    }),
                    createVNode(_component_el_option, {
                      label: "苹方",
                      value: "pingfang"
                    }),
                    createVNode(_component_el_option, {
                      label: "思源黑体",
                      value: "source-han-sans"
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ]),
              _: 1
            }),
            createVNode(_component_el_form_item, { label: "界面缩放" }, {
              default: withCtx(() => [
                createVNode(_component_el_select, {
                  modelValue: config.scale,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => config.scale = $event)
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_option, {
                      label: "100%",
                      value: "1.0"
                    }),
                    createVNode(_component_el_option, {
                      label: "110%",
                      value: "1.1"
                    }),
                    createVNode(_component_el_option, {
                      label: "125%",
                      value: "1.25"
                    }),
                    createVNode(_component_el_option, {
                      label: "150%",
                      value: "1.5"
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ]),
              _: 1
            }),
            createVNode(_component_el_form_item, null, {
              default: withCtx(() => [
                createVNode(_component_el_button, {
                  type: "primary",
                  onClick: handleSave
                }, {
                  default: withCtx(() => [..._cache[7] || (_cache[7] = [
                    createTextVNode("保存配置", -1)
                  ])]),
                  _: 1
                }),
                createVNode(_component_el_button, { onClick: handleReset }, {
                  default: withCtx(() => [..._cache[8] || (_cache[8] = [
                    createTextVNode("重置", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["model"])
      ]);
    };
  }
});
const AppearanceConfig = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-345455fe"]]);
export {
  AppearanceConfig as default
};
