import { d as defineComponent, c as createElementBlock, b as createBaseVNode, a as createVNode, w as withCtx, j as unref, n as folder_default, e as createTextVNode, k as createBlock, f as createCommentVNode, l as reactive, E as ElMessage, g as resolveComponent, o as openBlock, _ as _export_sfc } from "./index-BjmZCG1l.js";
const _hoisted_1 = { class: "basic-config" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BasicConfig",
  setup(__props) {
    const defaultConfig = {
      language: "zh-CN",
      dataPath: "",
      autoSave: true,
      autoSaveInterval: 30
    };
    const config = reactive({ ...defaultConfig });
    const selectDataPath = () => {
      ElMessage.info("目录选择功能待实现");
    };
    const handleSave = () => {
      ElMessage.success("配置已保存");
    };
    const handleReset = () => {
      Object.assign(config, defaultConfig);
      ElMessage.info("配置已重置");
    };
    return (_ctx, _cache) => {
      const _component_el_option = resolveComponent("el-option");
      const _component_el_select = resolveComponent("el-select");
      const _component_el_form_item = resolveComponent("el-form-item");
      const _component_el_button = resolveComponent("el-button");
      const _component_el_input = resolveComponent("el-input");
      const _component_el_switch = resolveComponent("el-switch");
      const _component_el_input_number = resolveComponent("el-input-number");
      const _component_el_form = resolveComponent("el-form");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[9] || (_cache[9] = createBaseVNode("h2", null, "基础配置", -1)),
        createVNode(_component_el_form, {
          model: config,
          "label-width": "120px",
          class: "config-form"
        }, {
          default: withCtx(() => [
            createVNode(_component_el_form_item, { label: "语言" }, {
              default: withCtx(() => [
                createVNode(_component_el_select, {
                  modelValue: config.language,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => config.language = $event)
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_option, {
                      label: "简体中文",
                      value: "zh-CN"
                    }),
                    createVNode(_component_el_option, {
                      label: "English",
                      value: "en-US"
                    }),
                    createVNode(_component_el_option, {
                      label: "日本語",
                      value: "ja-JP"
                    })
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ]),
              _: 1
            }),
            createVNode(_component_el_form_item, { label: "数据存储路径" }, {
              default: withCtx(() => [
                createVNode(_component_el_input, {
                  modelValue: config.dataPath,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => config.dataPath = $event),
                  placeholder: "选择数据存储路径",
                  readonly: ""
                }, {
                  append: withCtx(() => [
                    createVNode(_component_el_button, {
                      icon: unref(folder_default),
                      onClick: selectDataPath
                    }, {
                      default: withCtx(() => [..._cache[4] || (_cache[4] = [
                        createTextVNode(" 浏览 ", -1)
                      ])]),
                      _: 1
                    }, 8, ["icon"])
                  ]),
                  _: 1
                }, 8, ["modelValue"])
              ]),
              _: 1
            }),
            createVNode(_component_el_form_item, { label: "自动保存" }, {
              default: withCtx(() => [
                createVNode(_component_el_switch, {
                  modelValue: config.autoSave,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => config.autoSave = $event)
                }, null, 8, ["modelValue"]),
                _cache[5] || (_cache[5] = createBaseVNode("span", { class: "form-tip" }, "启用后自动保存编辑内容", -1))
              ]),
              _: 1
            }),
            config.autoSave ? (openBlock(), createBlock(_component_el_form_item, {
              key: 0,
              label: "保存间隔"
            }, {
              default: withCtx(() => [
                createVNode(_component_el_input_number, {
                  modelValue: config.autoSaveInterval,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => config.autoSaveInterval = $event),
                  min: 10,
                  max: 300,
                  step: 10
                }, null, 8, ["modelValue"]),
                _cache[6] || (_cache[6] = createBaseVNode("span", { class: "form-tip" }, "秒（10-300秒）", -1))
              ]),
              _: 1
            })) : createCommentVNode("", true),
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
const BasicConfig = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0c195558"]]);
export {
  BasicConfig as default
};
