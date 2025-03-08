import React, { useState } from 'react';
import {
    DockerOutlined,
    UserOutlined,
    BellOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Button, Layout, Menu, Space } from 'antd';
import Logo from '../../assets/logo.png'
import SearchInput from './SearchInput';
import PartnersTable from '../PartnersTable';
const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('Администрирование', 'sub1', <DockerOutlined />
        , [
            getItem('Tom', '3'),
            getItem('Bill', '4'),
            getItem('Alex', '5'),
        ]),
    getItem('Деньги', 'sub2', <DockerOutlined />, [
        getItem('Движение денег', '6'),
        getItem('Контрагенты', '7'),
        getItem('Правила распределения операций', '8'),
        getItem('Расчетные счета', '9'),
        getItem('Статьи операций', '10'),
    ]),
    getItem('Персонал', 'sub3', <DockerOutlined />, [
        getItem('User 1', '11'),
        getItem('User 2', '12'),
        getItem('User 3', '13'),
        getItem('User 4', '14'),
    ]),
];

function AppLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Sider theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{ margin: '15px' }}>
                    <img src={Logo} alt="Axsoft Development" height={collapsed ? '15px' : '30px'} style={{ transition: 'all 0.2s ease-in-out' }} />
                </div>
                <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout style={{ margin: '0 10px' }}>
                <Header style={{
                    padding: 0,
                    background: '#f5f5f5',
                    borderBottom: '2px solid #e6e6e8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }} >
                    <SearchInput />
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <Space size={5} wrap>
                            <Avatar icon={<BellOutlined />} />
                            <Avatar icon={<UserOutlined />} />
                            <p>User name</p>
                            <Button type="primary" shape="circle" style={{ backgroundColor: '#fb9835' }}>
                                <UserAddOutlined />
                            </Button>
                        </Space>
                    </div>
                </Header>
                <Content style={{
                    margin: '20px 10px',
                    minHeight: 360,
                    background: '#ffffff',
                    borderRadius: '5px',
                    boxShadow: '0px 0px 5px 0px rgba(99, 95, 95, 0.38) '
                }}>
                    <div style={{ borderBottom: '1px solid #e1e1e3' }}>
                        <h3 style={{ margin: 15 }}>Контрагенты</h3>
                    </div>
                    <PartnersTable />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;