import { ConfigProvider } from "antd"
import AppLayout from "./conponents/layout/AppLayout"

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            borderColor: '#ebebeb',
            headerBg: '#fafafa',
            headerBorderRadius: 10,
            cellPaddingBlock: 5,
            cellPaddingInlineMD: 1
          },
        }
      }}
    >
      <AppLayout />
    </ConfigProvider >
  )
}

export default App
