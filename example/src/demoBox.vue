<template>
  <section :id="id" :class="['code-box', codeExpand ? 'expand' : '']">
    <section class="code-box-demo">
      <template v-if="iframeDemo[iframeDemoKey]">
        <div class="browser-mockup with-url">
          <iframe :src="iframeDemo[iframeDemoKey]" height="360" />
        </div>
      </template>
      <template v-else>
        <slot name="component" />
      </template>
    </section>
    <section class="code-box-meta markdown">
      <slot v-if="isZhCN" name="description" />
      <slot v-else name="us-description" />
      <div class="code-box-actions">
        <a-tooltip
          :title="copied ? 'Copied!' : 'Copy code'"
          :visible="copyTooltipVisible"
          @visibleChange="onCopyTooltipVisibleChange"
        >
          <CheckOutlined
            v-clipboard:copy="sourceCode"
            v-clipboard:success="handleCodeCopied"
            class="code-box-code-copy"
            v-if="copied && copyTooltipVisible"
          />
          <CopyOutlined
            v-clipboard:copy="sourceCode"
            v-clipboard:success="handleCodeCopied"
            class="code-box-code-copy"
            v-else
          />
        </a-tooltip>
        <a-tooltip :title="codeExpand ? 'Hide Code' : 'Show Code'">
          <span class="code-expand-icon">
            <img
              width="16"
              alt="expand code"
              src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg"
              :class="codeExpand ? 'code-expand-icon-hide' : 'code-expand-icon-show'"
              @click="handleCodeExpand"
            />
            <img
              width="16"
              alt="expand code"
              src="https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg"
              :class="codeExpand ? 'code-expand-icon-show' : 'code-expand-icon-hide'"
              @click="handleCodeExpand"
            />
          </span>
        </a-tooltip>
      </div>
    </section>
    <transition appear :css="false" @enter="enter" @leave="leave">
      <section
        v-show="codeExpand"
        class="highlight-wrapper"
        style="position: relative;"
        v-html="getCode()"
      ></section>
    </transition>
  </section>
</template>
<script>
import animate from 'ant-design-vue/es/_util/openAnimation';
import BaseMixin from 'ant-design-vue/es/_util/BaseMixin';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons-vue';
export default {
  name: 'DemoBox',
  mixins: [BaseMixin],
  props: {
    jsfiddle: Object,
    isIframe: Boolean,
  },
  inject: {
    iframeDemo: { default: {} },
    demoContext: { default: {} },
  },
  components: {
    CheckOutlined,
    CopyOutlined,
  },
  data() {
    const { name = '' } = this.demoContext;
    console.log(this.jsfiddle)
    const { title, sourceCode, id } = this.jsfiddle;
    const usTitle = title['en-US'];
    const cnTitle = title['zh-CN'];
    if (process.env.NODE_ENV !== 'production' && usTitle === '') {
      throw new Error(`not have usTitle`);
    }
    const iframeDemoKey = usTitle
      .split(' ')
      .join('-')
      .toLowerCase();

    if (this.demoContext.store) {
      const { currentSubMenu } = this.demoContext.store.getState();
      this.demoContext.store.setState({
        currentSubMenu: [...currentSubMenu, { cnTitle, usTitle, id }],
      });
    }
    return {
      codeExpand: false,
      isZhCN: false,
      copied: false,
      copyTooltipVisible: false,
      sourceCode,
      // sourceCode: decodeURIComponent(escape(window.atob(sourceCode))),
      id,
      iframeDemoKey,
      isDemo: true,
    };
  },
  methods: {
    getCode() {
      const { $slots } = this;
      return decodeURIComponent(
        escape(window.atob(($slots.code && $slots.code[0] && $slots.code[0].text) || '')),
      );
    },
    handleCodeExpand() {
      this.codeExpand = !this.codeExpand;
    },
    enter: animate.enter,
    leave: animate.leave,
    handleCodeCopied() {
      this.setState({ copied: true });
    },

    onCopyTooltipVisibleChange(visible) {
      if (visible) {
        this.setState({
          copyTooltipVisible: visible,
          copied: false,
        });
        return;
      }
      this.setState({
        copyTooltipVisible: visible,
      });
    },
  },
};
</script>

