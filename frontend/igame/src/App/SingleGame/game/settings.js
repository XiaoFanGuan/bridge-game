/**
 * 考虑这里用单例模式。
 * 所有代码引入 settings 时引入的是相同的一个对象。不会实例化多个。
 * 貌似这个 settings 是不需要的。或者应该是完全固定的数据。无法修改。
 * 或者在父组件引入，子组件 通过父组件进行修改。
 */

const settings = {
    scale:1,                // 比例 根据屏幕变化调整比例。
}


export default settings;