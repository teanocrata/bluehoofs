import React, { useState, useEffect } from 'react';
import { Console as ConsoleFeed, Hook, Unhook } from 'console-feed';

import {CollapsibleList, SimpleListItem} from '@rmwc/list';

const Console = () => {
    const [logs, setLogs] = useState([])

    // run once!
    useEffect(() => {
        Hook(
            window.console,
            (log) => setLogs((currLogs) => [...currLogs, log] as any),
            false
        )
        return (() => {
            Unhook(window.console as any);
        })
    }, [])

    return (
        <CollapsibleList
            handle={<SimpleListItem
                text="Console"
                graphic="help"
                metaIcon="chevron_right"
            />}
        >
            <div style={{ backgroundColor: '#242424' }}>
                <ConsoleFeed
                    logs={logs}
                    variant={'dark'}
                />
            </div>
        </CollapsibleList>
    );
};

export { Console }
