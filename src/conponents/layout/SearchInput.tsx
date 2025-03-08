import { Flex, Input, Space } from 'antd';
import type { GetProps } from 'antd';

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

function SearchInput() {
    return (
        <Space direction="vertical" style={{ lineHeight: 0 }}>
            <Search
                size='small'
                placeholder="Поиск" onSearch={onSearch} style={{
                    width: 250,
                }} />
        </Space>
    )
}

export default SearchInput;