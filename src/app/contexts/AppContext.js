'use client'
import React, { createContext, useState } from "react";
import { findEntryPoint } from "../utils/renderUtils"


export const AppContext = createContext();


export const AppProvider = ({ children }) => {
    // state for updating scrren that is spassed torenderComponent on page.js

    /*
    const jsonDataApp = {
        "application": {
            "class": "application",
            "component": "whats the purpose of component here?",
            "cssFile": "to load main css. suggestion: rename field as cssFile instead of css (suggestions for other css - cssClass, cssInline)",
            "elements": {
                "S1": {
                    "class": "screen",
                    "component": "screenComponent",
                    "backgroundImage": "./images/arctic-background.png",
                    "cssClass": "main-screen",
                    "elements": {
                        "A1": {
                            "class": "area",
                            "component": "areaComponent",
                            "cssClass": "game-variables-container",
                            "elements": {
                                "score": {
                                    "caption": "Остаток дней",
                                    "class": "variable",
                                    "component": "gameVariableComponent",
                                    "cssClass": "game-variable",
                                    "cssInline": {
                                        "color": "#fff"
                                    },
                                    "backgroundImage": "./images/top-sidebar/days-top.png",
                                    "description": "Оставшееся время в игре. Основной параметр.",
                                    "value": 60,
                                    "actions": {
                                        "onClick": {
                                            "proc": "changeColor",
                                            "id": "score",
                                            "props": {
                                                "color": "pink"
                                            }
                                        },
                                        "onHover": {
                                            "proc": "showDescription",
                                            "props": {
                                                "description": "остаток дней в игре"
                                            }
                                        }
                                    }
                                },
                                "pro": {
                                    "class": "variable",
                                    "component": "gameVariableComponent",
                                    "cssClass": "game-variable",
                                    "backgroundImage": "./images/top-sidebar/znaniya.png",
                                    "description": "Уровень знаний, который игрок может приобрести и использовать для решения задач и преодоления препятствий. Они могут влиять на успешное завершение квестов, взаимодействие с другими персонажами и раскрытие сюжетных линий.",
                                    "caption": "Знания",
                                    "value": 0,
                                    "actions": {
                                        "onClick": {
                                            "proc": "onClick",
                                            "id": "pro"
                                        }
                                    }
                                },
                                "rep": {
                                    "class": "variable",
                                    "component": "gameVariableComponent",
                                    "cssClass": "game-variable",
                                    "backgroundImage": "./images/top-sidebar/doverie.png",
                                    "description": " Уровень доверия, который персонажи или организации проявляют к игроку. Это влияет на доступ к различным возможностям, информации и помощи, а также на возможность завоевать союзников и сформировать союзы в игровом мире.",
                                    "caption": "Доверие",
                                    "value": 0,
                                    "actions": {
                                        "onClick": {
                                            "proc": "onClick",
                                            "id": "rep"
                                        }
                                    }
                                },
                                "lead": {
                                    "class": "variable",
                                    "component": "gameVariableComponent",
                                    "cssClass": "game-variable",
                                    "caption": "Энергия",
                                    "backgroundImage": "./images/top-sidebar/energia.png",
                                    "description": "Уровень энергии, который определяет способность игрока к выполнению различных действий в игре. Он может влиять на возможность использования способностей и навыков",
                                    "value": 0,
                                    "actions": {
                                        "onClick": {
                                            "proc": "onClick",
                                            "id": "lead"
                                        }
                                    }
                                },
                                "man": {
                                    "class": "variable",
                                    "component": "gameVariableComponent",
                                    "cssClass": "game-variable",
                                    "caption": "контроль",
                                    "backgroundImage": "./images/top-sidebar/kontrol.png",
                                    "description": "Уровень контроля над игровой ситуацией. Это влияет на способность игрока управлять ходом сюжета, принимать решения и влиять на развитие игрового мира, а также на возможность управления своим персонажем и его действиями.",
                                    "value": 0,
                                    "actions": {
                                        "onClick": {
                                            "proc": "onClick",
                                            "id": "man"
                                        }
                                    }
                                },
                                "stat": {
                                    "class": "variable",
                                    "component": "gameVariableComponent",
                                    "cssClass": "game-variable",
                                    "backgroundImage": "./images/top-sidebar/status.png",
                                    "description": "Текущее состояние и положение игрока или персонажа в игровом мире. Это может включать в себя статус в обществе, репутацию, ранг, звание, уровень опыта и прочие характеристики, которые определяют степень влияния и важность персонажа в игре",
                                    "caption": "Статус",
                                    "value": 0,
                                    "actions": {
                                        "onClick": {
                                            "proc": "onClick",
                                            "id": "stat"
                                        }
                                    }
                                },
                                "cont": {
                                    "class": "variable",
                                    "component": "gameVariableComponent",
                                    "cssClass": "game-variable",
                                    "backgroundImage": "./images/top-sidebar/kontakt.png",
                                    "description": "Количество доступных контактов, связей или информационных ресурсов, на которые может полагаться игрок. Это может включать в себя доступ к союзникам, контрагентам, информаторам, специалистам и другим ключевым персонажам или ресурсам, которые могут быть полезны в различных ситуациях и заданиях.",
                                    "caption": "Контакт",
                                    "value": 0,
                                    "actions": {
                                        "onClick": {
                                            "proc": "onClick",
                                            "id": "cont"
                                        }
                                    }
                                },
                                "constr": {
                                    "class": "variable",
                                    "component": "gameVariableComponent",
                                    "cssClass": "game-variable",
                                    "backgroundImage": "./images/top-sidebar/konstruktiv.png",
                                    "description": " Уровень конструктивности подхода игрока к решению проблем и взаимодействию с окружающим миром. Это включает в себя способность игрока мыслить креативно, находить решения, способствующие продвижению вперед, и строить отношения на основе сотрудничества, уважения и взаимопонимани",
                                    "caption": "Конструктив",
                                    "value": 0,
                                    "actions": {
                                        "onClick": {
                                            "proc": "onClick",
                                            "id": "constr"
                                        }
                                    }
                                }
                            }
                        },
                        "A2": {
                            "class": "area",
                            "cssClass": "cards-container",
                            "component": "areaComponent",
                            "elements": {
                                "C1": {
                                    "class": "card",
                                    "component": "cardComponent",
                                    "cssClass": "game-card",
                                    "state": "st1",
                                    "text": "Есть идея! Создать клуб изучения айсберга! Совместно с другими любопытными проводить наблюдения снаружи и внутри айсберга, обсуждать закономерности и прогнозы.",
                                    "actions": {
                                        "onClick": {
                                            "proc": "requestServer",
                                            "id": "C1"
                                        }
                                    }
                                },
                                "C2": {
                                    "class": "card",
                                    "component": "cardComponent",
                                    "cssClass": "game-card",
                                    "state": "st3",
                                    "text": "Рассказать как можно большему количеству пингвинов. Начать с близких друзей, затем – друзьям друзей и далее… Вероятно, о проблеме узнают все и дело пойдет!",
                                    "actions": {
                                        "onClick": {
                                            "proc": "requestServer",
                                            "id": "C2"
                                        }
                                    }
                                },
                                "C3": {
                                    "class": "card",
                                    "component": "cardComponent",
                                    "cssClass": "game-card",
                                    "state": "st5",
                                    "text": "Поговорить с Аленой. Алена входит в Совет, ориентирована на достижения, всегда добивается результата. Быстро схватывает новые идеи. Быстро и остывает, если не видит скорой и явной отдачи.",
                                    "actions": {
                                        "onClick": {
                                            "proc": "requestServer",
                                            "id": "C3"
                                        }
                                    }
                                },
                                "C4": {
                                    "class": "card",
                                    "component": "cardComponent",
                                    "cssClass": "game-card",
                                    "state": "st7",
                                    "text": "Можно зайти к Георгию. Он входит в Совет, очень умен и авторитетен, недаром его зовут Профессор. Он любит изучать проблемы, любит искать решения. Возможно, он видел Федора в Департаменте погоды...",
                                    "actions": {
                                        "onClick": {
                                            "proc": "onClick",
                                            "id": "C4"
                                        }
                                    }
                                },
                                "C5": {
                                    "class": "card",
                                    "component": "cardComponent",
                                    "cssClass": "game-card",
                                    "state": "st9",
                                    "text": "Обратиться сразу к Вожаку всех пингвинов – Леониду. Он, конечно, очень занят всякими важными делами, поэтому нужно заранее записаться на прием, но если он поддержит!...",
                                    "actions": {
                                        "onClick": {
                                            "proc": "onClick",
                                            "id": "C5"
                                        }
                                    }
                                },
                                "C6": {
                                    "class": "card",
                                    "component": "cardComponent",
                                    "cssClass": "game-card",
                                    "state": "st11",
                                    "text": "Встретиться с Василием. Он общительный и всегда готов обсудить что угодно. Еще Василий входит в Совет. Любит все свести в шутку и частенько опаздывает.",
                                    "actions": {
                                        "onClick": {
                                            "proc": "onClick",
                                            "id": "C6"
                                        }
                                    }
                                }
                            },
                            "A3": {
                                "class": "area",
                                "component": "areaComponent",
                                "cssClass": "button-container",
                                "elements": {
                                    "B1": {
                                        "class": "button",
                                        "cssClass": "button-next",
                                        "component": "buttonComponent",
                                        "caption": "Далее",
                                        "actions": {
                                            "onClick": {
                                                "proc": "onClick",
                                                "id": "B1"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "A6": {
                            "class": "area",
                            "component": "areaComponent",
                            "cssClass": "button-container",
                            "elements": {
                                "B2": {
                                    "class": "button",
                                    "component": "buttonComponent",
                                    "cssClass": "button-next",
                                    "caption": "Далее",
                                    "actions": {
                                        "onClick": {
                                            "proc": "onClick",
                                            "id": "B2"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }



    const entryPointKey = findEntryPoint(jsonDataApp)
*/
    const [appState, setAppState] = useState(jsonDataApp.application.elements[entryPointKey]);

    // WRAPPER 
    const updateAppState = (newState) => {
        setAppState(newState);
    };

    return (
        <AppContext.Provider value={{ appState, updateAppState }}>
            {children}
        </AppContext.Provider>
    );
};
