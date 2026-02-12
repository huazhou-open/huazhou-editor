import { d as defineComponent, h as watch, c as createElementBlock, a as createVNode, w as withCtx, b as createBaseVNode, u as useRouter, i as useRoute, r as ref, g as resolveComponent, o as openBlock, _ as _export_sfc } from "./index-BjmZCG1l.js";
const _hoisted_1$1 = { class: "settings-group" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SettingsGroup",
  setup(__props) {
    const router = useRouter();
    const route = useRoute();
    const activeKey = ref("models");
    watch(
      () => route.path,
      (path) => {
        const match = path.match(/\/settings\/(\w+)/);
        if (match) {
          activeKey.value = match[1];
        }
      },
      { immediate: true }
    );
    const handleSelect = (key) => {
      router.push(`/settings/${key}`);
    };
    return (_ctx, _cache) => {
      const _component_Connection = resolveComponent("Connection");
      const _component_el_icon = resolveComponent("el-icon");
      const _component_el_menu_item = resolveComponent("el-menu-item");
      const _component_Setting = resolveComponent("Setting");
      const _component_Brush = resolveComponent("Brush");
      const _component_el_menu = resolveComponent("el-menu");
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createVNode(_component_el_menu, {
          "default-active": activeKey.value,
          class: "settings-menu",
          onSelect: handleSelect
        }, {
          default: withCtx(() => [
            createVNode(_component_el_menu_item, { index: "models" }, {
              default: withCtx(() => [
                createVNode(_component_el_icon, null, {
                  default: withCtx(() => [
                    createVNode(_component_Connection)
                  ]),
                  _: 1
                }),
                _cache[0] || (_cache[0] = createBaseVNode("span", null, "模型管理", -1))
              ]),
              _: 1
            }),
            createVNode(_component_el_menu_item, { index: "basic" }, {
              default: withCtx(() => [
                createVNode(_component_el_icon, null, {
                  default: withCtx(() => [
                    createVNode(_component_Setting)
                  ]),
                  _: 1
                }),
                _cache[1] || (_cache[1] = createBaseVNode("span", null, "基础配置", -1))
              ]),
              _: 1
            }),
            createVNode(_component_el_menu_item, { index: "appearance" }, {
              default: withCtx(() => [
                createVNode(_component_el_icon, null, {
                  default: withCtx(() => [
                    createVNode(_component_Brush)
                  ]),
                  _: 1
                }),
                _cache[2] || (_cache[2] = createBaseVNode("span", null, "外观设置", -1))
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["default-active"])
      ]);
    };
  }
});
const SettingsGroup = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-b6650cb0"]]);
const _hoisted_1 = { class: "settings-container" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Settings",
  setup(__props) {
    return (_ctx, _cache) => {
      const _component_el_aside = resolveComponent("el-aside");
      const _component_router_view = resolveComponent("router-view");
      const _component_el_main = resolveComponent("el-main");
      const _component_el_container = resolveComponent("el-container");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(_component_el_container, { class: "settings-content" }, {
          default: withCtx(() => [
            createVNode(_component_el_aside, { width: "200px" }, {
              default: withCtx(() => [
                createVNode(SettingsGroup)
              ]),
              _: 1
            }),
            createVNode(_component_el_main, null, {
              default: withCtx(() => [
                createVNode(_component_router_view)
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
const Settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-da5877b5"]]);
export {
  Settings as default
};
