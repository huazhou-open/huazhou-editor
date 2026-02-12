import { d as defineComponent, c as createElementBlock, b as createBaseVNode, a as createVNode, w as withCtx, e as createTextVNode, j as unref, p as plus_default, k as createBlock, f as createCommentVNode, r as ref, l as reactive, E as ElMessage, m as ElMessageBox, g as resolveComponent, o as openBlock, _ as _export_sfc } from "./index-BjmZCG1l.js";
const _hoisted_1 = { class: "model-management" };
const _hoisted_2 = { class: "page-header" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ModelManagement",
  setup(__props) {
    const models = ref([
      {
        id: "1",
        name: "GPT-4",
        provider: "openai",
        apiEndpoint: "https://api.openai.com/v1",
        isDefault: true,
        maxTokens: 4096,
        temperature: 0.7
      }
    ]);
    const showAddDialog = ref(false);
    const formData = reactive({
      name: "",
      provider: "",
      apiKey: "",
      apiEndpoint: "",
      maxTokens: 4096,
      temperature: 0.7,
      isDefault: false
    });
    const formRules = {
      name: [{ required: true, message: "请输入模型名称", trigger: "blur" }],
      provider: [{ required: true, message: "请选择提供商", trigger: "change" }]
    };
    const resetForm = () => {
      Object.assign(formData, {
        name: "",
        provider: "",
        apiKey: "",
        apiEndpoint: "",
        maxTokens: 4096,
        temperature: 0.7,
        isDefault: false
      });
    };
    const handleAdd = () => {
      if (!formData.name || !formData.provider) {
        ElMessage.warning("请填写必填项");
        return;
      }
      const newModel = {
        id: Date.now().toString(),
        name: formData.name,
        provider: formData.provider,
        apiKey: formData.apiKey,
        apiEndpoint: formData.apiEndpoint,
        maxTokens: formData.maxTokens,
        temperature: formData.temperature,
        isDefault: false
      };
      models.value.push(newModel);
      showAddDialog.value = false;
      ElMessage.success("添加成功");
      resetForm();
    };
    const handleSetDefault = (row) => {
      models.value.forEach((m) => m.isDefault = m.id === row.id);
      ElMessage.success("已设为默认模型");
    };
    const handleDelete = (row) => {
      ElMessageBox.confirm("确定要删除这个模型吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const index = models.value.findIndex((m) => m.id === row.id);
        if (index > -1) {
          models.value.splice(index, 1);
          ElMessage.success("删除成功");
        }
      }).catch(() => {
      });
    };
    return (_ctx, _cache) => {
      const _component_el_button = resolveComponent("el-button");
      const _component_el_table_column = resolveComponent("el-table-column");
      const _component_el_tag = resolveComponent("el-tag");
      const _component_el_table = resolveComponent("el-table");
      const _component_el_input = resolveComponent("el-input");
      const _component_el_form_item = resolveComponent("el-form-item");
      const _component_el_option = resolveComponent("el-option");
      const _component_el_select = resolveComponent("el-select");
      const _component_el_input_number = resolveComponent("el-input-number");
      const _component_el_form = resolveComponent("el-form");
      const _component_el_dialog = resolveComponent("el-dialog");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          _cache[10] || (_cache[10] = createBaseVNode("h2", null, "模型管理", -1)),
          createVNode(_component_el_button, {
            type: "primary",
            icon: unref(plus_default),
            onClick: _cache[0] || (_cache[0] = ($event) => showAddDialog.value = true)
          }, {
            default: withCtx(() => [..._cache[9] || (_cache[9] = [
              createTextVNode(" 添加模型 ", -1)
            ])]),
            _: 1
          }, 8, ["icon"])
        ]),
        createVNode(_component_el_table, {
          data: models.value,
          stripe: ""
        }, {
          default: withCtx(() => [
            createVNode(_component_el_table_column, {
              prop: "name",
              label: "模型名称"
            }),
            createVNode(_component_el_table_column, {
              prop: "provider",
              label: "提供商"
            }),
            createVNode(_component_el_table_column, {
              prop: "apiEndpoint",
              label: "API 端点"
            }),
            createVNode(_component_el_table_column, {
              prop: "maxTokens",
              label: "最大令牌",
              width: "120"
            }),
            createVNode(_component_el_table_column, {
              prop: "temperature",
              label: "温度",
              width: "100"
            }),
            createVNode(_component_el_table_column, {
              label: "默认",
              width: "80"
            }, {
              default: withCtx(({ row }) => [
                row.isDefault ? (openBlock(), createBlock(_component_el_tag, {
                  key: 0,
                  type: "success",
                  size: "small"
                }, {
                  default: withCtx(() => [..._cache[11] || (_cache[11] = [
                    createTextVNode("默认", -1)
                  ])]),
                  _: 1
                })) : createCommentVNode("", true)
              ]),
              _: 1
            }),
            createVNode(_component_el_table_column, {
              label: "操作",
              width: "150"
            }, {
              default: withCtx(({ row }) => [
                !row.isDefault ? (openBlock(), createBlock(_component_el_button, {
                  key: 0,
                  link: "",
                  type: "primary",
                  size: "small",
                  onClick: ($event) => handleSetDefault(row)
                }, {
                  default: withCtx(() => [..._cache[12] || (_cache[12] = [
                    createTextVNode(" 设为默认 ", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])) : createCommentVNode("", true),
                createVNode(_component_el_button, {
                  link: "",
                  type: "danger",
                  size: "small",
                  onClick: ($event) => handleDelete(row)
                }, {
                  default: withCtx(() => [..._cache[13] || (_cache[13] = [
                    createTextVNode(" 删除 ", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["data"]),
        createVNode(_component_el_dialog, {
          modelValue: showAddDialog.value,
          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => showAddDialog.value = $event),
          title: "添加模型",
          width: "500px",
          onClose: resetForm
        }, {
          footer: withCtx(() => [
            createVNode(_component_el_button, {
              onClick: _cache[7] || (_cache[7] = ($event) => showAddDialog.value = false)
            }, {
              default: withCtx(() => [..._cache[14] || (_cache[14] = [
                createTextVNode("取消", -1)
              ])]),
              _: 1
            }),
            createVNode(_component_el_button, {
              type: "primary",
              onClick: handleAdd
            }, {
              default: withCtx(() => [..._cache[15] || (_cache[15] = [
                createTextVNode("确定", -1)
              ])]),
              _: 1
            })
          ]),
          default: withCtx(() => [
            createVNode(_component_el_form, {
              model: formData,
              rules: formRules,
              "label-width": "100px"
            }, {
              default: withCtx(() => [
                createVNode(_component_el_form_item, {
                  label: "模型名称",
                  prop: "name"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_input, {
                      modelValue: formData.name,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => formData.name = $event),
                      placeholder: "例如: GPT-4"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_el_form_item, {
                  label: "提供商",
                  prop: "provider"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_select, {
                      modelValue: formData.provider,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => formData.provider = $event),
                      placeholder: "选择提供商"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_el_option, {
                          label: "OpenAI",
                          value: "openai"
                        }),
                        createVNode(_component_el_option, {
                          label: "Anthropic",
                          value: "anthropic"
                        }),
                        createVNode(_component_el_option, {
                          label: "Azure",
                          value: "azure"
                        }),
                        createVNode(_component_el_option, {
                          label: "其他",
                          value: "other"
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_el_form_item, {
                  label: "API 密钥",
                  prop: "apiKey"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_input, {
                      modelValue: formData.apiKey,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => formData.apiKey = $event),
                      type: "password",
                      placeholder: "sk-...",
                      "show-password": ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_el_form_item, {
                  label: "API 端点",
                  prop: "apiEndpoint"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_input, {
                      modelValue: formData.apiEndpoint,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => formData.apiEndpoint = $event),
                      placeholder: "https://api.openai.com/v1"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_el_form_item, { label: "最大令牌" }, {
                  default: withCtx(() => [
                    createVNode(_component_el_input_number, {
                      modelValue: formData.maxTokens,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => formData.maxTokens = $event),
                      min: 1,
                      max: 1e5
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                createVNode(_component_el_form_item, { label: "温度" }, {
                  default: withCtx(() => [
                    createVNode(_component_el_input_number, {
                      modelValue: formData.temperature,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => formData.temperature = $event),
                      min: 0,
                      max: 2,
                      step: 0.1,
                      precision: 1
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
});
const ModelManagement = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8ddceb69"]]);
export {
  ModelManagement as default
};
