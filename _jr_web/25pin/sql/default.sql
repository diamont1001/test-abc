-- 查询所有拥有两个APP以上的公司名：
SELECT developer, count(*) as A FROM tb_app where status = 1 group by developer having A>1 ORDER BY A desc;
