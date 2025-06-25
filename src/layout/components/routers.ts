interface Route {
  path: string
  meta: object
}
class RouteStack {
  private stack: Route[] = []

  add(route: Route) {
    console.log('添加路由:', route.path, this.stack, 'stacasd1')
    // 避免重复添加相同路由（如刷新页面或重复访问同一页面）
    if (this.stack.length > 0 && this.stack.some((it) => it.path === route.path)) {
      return
    }

    // 保留完整历史记录，不删除已存在的同一路由
    this.stack.push(route)

    // 限制最大长度，避免内存溢出
    if (this.stack.length > 20) {
      this.stack.shift()
    }

    console.log(
      '当前路由栈:',
      this.stack.map((item) => item.path),
    )
  }

  jump(targetIndex: number) {
    // this.stack = this.stack.slice(0, targetIndex + 1)
    console.log(
      '跳转后栈:',
      this.stack.map((item) => item.path),
    )
  }

  getStack() {
    return this.stack
  }
}

export const routeStack = new RouteStack()
